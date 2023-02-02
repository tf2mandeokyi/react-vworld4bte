class Globe {
    atmosphereBrightnessShift: number
    atmosphereHueShift: number
    atmosphereSaturationShift: number
    backFaceCulling: boolean
    depthTestAgainstTerrain: boolean
    dynamicAtmosphereLighting: boolean
    dynamicAtmosphereLightingFromSun: boolean
    enableLighting: boolean
    fillHighlightColor: ws3d.common.Color
    lightingFadeInDistance: number
    lightingFadeOutDistance: number
    loadingDescendantLimit: number
    maximumScreenSpaceError: number
    nightFadeInDistance: number
    nightFadeOutDistance: number
    preloadAncestors: boolean
    preloadSiblings: boolean
    shadows: number
    show: boolean
    showGroundAtmosphere: boolean
    showSkirts: boolean
    showWaterEffect: boolean
    tileCacheSize: number

    baseColor: ws3d.common.Color;
    cartographicLimitRectangle
    clippingPlanes
    ellipsoid
    imageryLayers
    imageryLayersUpdatedEvent
    material
    oceanNormalMapUrl
    terrainProvider
    terrainProviderChanged
    tileLoadProgressEvent
    tilesLoaded
    translucency
    undergroundColor: ws3d.common.Color;
    undergroundColorAlphaByDistance

    beginFrame(t)
    destroy()
    endFrame(e)
    getHeight(coord: ws3d.common.Cartographic)
    isDestroyed()
    pick(e,t,i)
    pickWorldCoordinates(e,t,i,n)
    render(e)
    update(e)
}