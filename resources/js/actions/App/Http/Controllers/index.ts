import PublicGalleryController from './PublicGalleryController'
import PhotoSubmissionController from './PhotoSubmissionController'
import Settings from './Settings'

const Controllers = {
    PublicGalleryController: Object.assign(PublicGalleryController, PublicGalleryController),
    PhotoSubmissionController: Object.assign(PhotoSubmissionController, PhotoSubmissionController),
    Settings: Object.assign(Settings, Settings),
}

export default Controllers