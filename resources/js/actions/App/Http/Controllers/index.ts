import PublicGalleryController from './PublicGalleryController'
import StaticPageController from './StaticPageController'
import PhotoSubmissionController from './PhotoSubmissionController'
import Settings from './Settings'

const Controllers = {
    PublicGalleryController: Object.assign(PublicGalleryController, PublicGalleryController),
    StaticPageController: Object.assign(StaticPageController, StaticPageController),
    PhotoSubmissionController: Object.assign(PhotoSubmissionController, PhotoSubmissionController),
    Settings: Object.assign(Settings, Settings),
}

export default Controllers