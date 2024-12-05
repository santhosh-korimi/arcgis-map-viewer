'use client'

import React, { useEffect, useRef } from 'react'
import { loadModules } from 'esri-loader'

const MapViewer: React.FC = () => {
    const mapRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        loadModules([
            'esri/Map',
            'esri/views/MapView',
            'esri/widgets/Search',
            'esri/widgets/Home',
            'esri/layers/GeoJSONLayer',
            'esri/widgets/Legend',
            'esri/PopupTemplate'
        ]).then(([Map, MapView, Search, Home, GeoJSONLayer, Legend, PopupTemplate]) => {
            const map = new Map({
                basemap: 'gray-vector'
            })

            const view = new MapView({
                container: mapRef.current!,
                map: map,
                center: [-100, 40],
                zoom: 4
            })

            // Add Search widget
            const search = new Search({ view })
            view.ui.add(search, 'top-right')

            // Add Home widget
            const home = new Home({ view })
            view.ui.add(home, 'top-left')

            // Add GeoJSON Layer
            const geojsonUrl = 'https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_month.geojson'
            const geojsonLayer = new GeoJSONLayer({
                url: geojsonUrl,
                copyright: 'USGS Earthquakes',
                popupTemplate: new PopupTemplate({
                    title: 'Earthquake Info',
                    content: [
                        {
                            type: 'fields',
                            fieldInfos: [
                                { fieldName: 'mag', label: 'Magnitude' },
                                { fieldName: 'place', label: 'Location' },
                                { fieldName: 'time', label: 'Date', format: { dateFormat: 'short-date-short-time' } }
                            ]
                        }
                    ]
                }),
                renderer: {
                    type: 'simple',
                    symbol: {
                        type: 'simple-marker',
                        color: [88, 202, 192, 0.7], // marker color
                        outline: {
                            width: 0.5,
                            color: [70, 163, 152, 1] // marker outline
                        }
                    },
                    visualVariables: [
                        {
                            type: 'size',
                            field: 'mag',
                            stops: [
                                { value: 2.5, size: 4 },
                                { value: 6, size: 40 }
                            ]
                        }
                    ]
                }
            })

            map.add(geojsonLayer)

            // Add Legend
            const legend = new Legend({
                view: view,
                layerInfos: [
                    {
                        layer: geojsonLayer,
                        title: 'Earthquakes'
                    }
                ]
            })

            view.ui.add(legend, 'bottom-left')

            return () => {
                if (view) {
                    view.destroy()
                }
            }
        })
    }, [])

    return <div ref={mapRef} className="map-viewer" />
}

export default MapViewer

