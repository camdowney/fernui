import React, { useEffect, useRef, useState } from 'react'
import { Map, Overlay, View } from 'ol'
import { easeOut } from 'ol/easing.js'
import { containsCoordinate, extend } from 'ol/extent.js'
import { fromLonLat, transform } from 'ol/proj.js'
import { OSM } from 'ol/source.js'
import { Tile } from 'ol/layer.js'
import { cn, oc, stringify, throttle } from '@fernui/util'
import { useThrottle } from '@fernui/react-util'

export const useMap = <T extends unknown>(items: T[]) => {
  const [hovered, setHovered] = useState<T | null>(null)
  const [idsInView, setIdsInView] = useState<number[] | null>(null)
  const itemsInView = items.filter((_, i) => !idsInView || idsInView.some(id => id === i))

  return { setIdsInView, itemsInView, hovered, setHovered }
}

export interface MapMarker {
  id: string
  latitude: number
  longitude: number
  label?: string
}

export const ReactOpenLayers = <T extends MapMarker>({
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
}) => {
  const mapRef = useRef<any>(null)
  const markersRef = useRef<any>([])
  const map = useRef<any>()

  const centerTransform = transform(center ? [center[1], center[0]] : [0, 0], 'EPSG:4326', 'EPSG:3857')
  const centerStored = useRef(stringify(centerTransform))
  const zoomStored = useRef(zoom)

  const extentStored = useRef('')
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
      .map((marker, i) => ({ ...marker, id: i }))
      .sort((l, r) => l.latitude > r.latitude ? 1 : -1)
      .forEach(marker =>
        map.current.addOverlay(new Overlay({
          id: marker.id,
          position: fromLonLat([marker.longitude, marker.latitude]),
          positioning: 'center-center',
          element: markersRef.current[marker.id],
          className: 'fui-map-loaded',
          stopEvent: false,
        }))
      )

    if (!loaded.current)
      fitViewToMarkers()

    if (onAdjust) onAdjust(null)
  }, [markers])

  useThrottle({
    callback: () => fitViewToMarkers(),
    delayMilliseconds: animationDuration,
    dependencies: [markers],
  })

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

  const fitViewToMarkers = () => {
    if (center) return

    const extent = getExtent()

    if (!extent || stringify(extent) === extentStored.current) return

    map.current.getView().fit(extent, {
      size: map.current.getSize(),
      duration: loaded.current ? animationDuration : 0,
    })

    extentStored.current = stringify(extent)
    loaded.current = true
  }

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
        style={oc(styles.cover)}
      />

      <div
        ref={mapRef}
        style={oc(styles.cover)}
      >
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

const styles = {
  cover: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    width: '100%',
    height: '100%',
  },
}