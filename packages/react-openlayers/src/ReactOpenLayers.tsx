import React, { useEffect, useRef } from 'react'
import { cn, createStopwatch, stringify, throttle } from '@fernui/util'
import { Map, Overlay, View } from 'ol'
import { fromLonLat, transform } from 'ol/proj'
import { easeOut } from 'ol/easing'
import { containsCoordinate, extend } from 'ol/extent'
import { Tile } from 'ol/layer'
import { OSM } from 'ol/source'
import 'ol/ol.css'

export interface MapMarker {
  id: string
  latitude: number
  longitude: number
  label?: string
}

export default function Component<T extends MapMarker>({
  center,
  zoom = 1,
  animationDuration = 500,
  markers,
  onAdjust,
  children,
  markerClass,
  ...props
}: {
  center?: [number, number]
  zoom?: number
  animationDuration?: number
  markers: T[]
  onAdjust?: (markerIdsInView: number[] | null) => any
  children?: (marker: T) => any
  markerClass?: string
  [props: string]: any
}) {
  const mapRef = useRef<any>(null)
  const markersRef = useRef<any>([])
  const map = useRef<any>()

  const centerTransform = transform(center ? [center[1], center[0]] : [0, 0], 'EPSG:4326', 'EPSG:3857')
  const centerStored = useRef(stringify(centerTransform))
  const zoomStored = useRef(zoom)

  const extentStored = useRef('')
  const fitTimeoutId = useRef<any>()
  const stopwatch = useRef(createStopwatch())
  const loaded = useRef(false)

  // Init map
  useEffect(() => {
    map.current = new Map({
      target: mapRef.current,
      layers: [new Tile({ source: new OSM() })],
      view: new View({
        center: centerTransform,
        zoom,
        projection: 'EPSG:3857',
      }),
    })

    if (onAdjust)
      map.current.on('pointermove', throttle(setOverlaysInView, 100))

    return () => map.current.dispose()
  }, [])

  // Watch center
  useEffect(() => {
    if (stringify(centerTransform) === centerStored.current) return
    centerStored.current = stringify(centerTransform)
   
    map.current.getView().animate({
      center: centerTransform,
      duration: animationDuration,
      easing: easeOut,
    })
  }, [center])

  // Watch zoom
  useEffect(() => {
    if (zoom === zoomStored.current) return
    zoomStored.current = zoom

    map.current.getView().animate({
      zoom,
      duration: animationDuration,
      easing: easeOut,
    })
  }, [zoom])

  // Watch markers
  useEffect(() => {
    map.current.getOverlays().clear()

    markers
      .map((m, i) => ({ d: m, i }))
      .sort((l, r) => l.d.latitude > r.d.latitude ? 1 : -1)
      .forEach(m =>
        map.current.addOverlay(new Overlay({
          id: m.i,
          position: fromLonLat([m.d.longitude, m.d.latitude]),
          positioning: 'center-center',
          element: markersRef.current[m.i],
          className: 'fui-map-loaded',
          stopEvent: false,
        }))
      )
    
    fit()
    if (onAdjust) onAdjust(null)
  }, [markers])

  // Retrieve the extent of current map markers
  const getExtent = () => {
    let extent: any = null

    map.current.getOverlays().forEach((overlay: any) => {
      const pos = overlay.getPosition()
      const off = 7000

      if (!pos) return

      const extentCurr = [pos[0]-off, pos[1]-off, pos[0]+off, pos[1]+off]

      extent = extent ? extend(extent, extentCurr) : extentCurr
    })

    return extent
  }

  // Get marker extent and fit markers to screen
  const fit = () => {
    if (center) return

    const extent = getExtent()

    if (!extent || stringify(extent) === extentStored.current) return

    clearTimeout(fitTimeoutId.current)
    
    if (stopwatch.current.time() < 1 || stopwatch.current.time() >= animationDuration)
      fitMarkers(extent)
    else
      fitTimeoutId.current = setTimeout(() => fitMarkers(extent), animationDuration - stopwatch.current.time())
  }

  // Fit markers to screen
  const fitMarkers = (extent: any) => {
    const duration = loaded.current ? animationDuration : 0
    extentStored.current = stringify(extent)
    loaded.current = true

    stopwatch.current.reset()
    stopwatch.current.start()

    map.current.getView().fit(extent, {
      size: map.current.getSize(),
      duration,
    })
  }

  // Get all overlays currently in view
  const setOverlaysInView = () => {
    if (!onAdjust) return

    const extent = map.current.getView().calculateExtent(map.current.getSize())
  
    onAdjust(
      map.current.getOverlays().getArray()
        .filter((o: any) => o.getPosition() && containsCoordinate(extent, o.getPosition()))
        .map((o: any )=> Number(o.id))
    )
  }

  return (
    <div
      style={{ position: 'relative' }}
      {...props}
    >
      <div
        className='fui-map-loading'
        style={_coverStyle as Object}
      />

      <div ref={mapRef} style={_coverStyle as Object}>
        {markers.map((marker, index) =>
          <span key={marker.id}>
            <span ref={(el: any) => markersRef.current[index] = el}>
              {children ? (
                children(marker)
              ) : (
                <div className={cn('fui-map-marker', markerClass)}>
                  {marker.label ?? ''}
                </div>
              )}
            </span>
          </span>
        )}
      </div>
    </div>
  )
}

const _coverStyle = {
  position: 'absolute',
  top: 0,
  bottom: 0,
  width: '100%',
  height: '100%',
}