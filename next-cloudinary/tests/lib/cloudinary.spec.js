import { constructCloudinaryUrl, getPublicId, createPlaceholderUrl } from '../../src/lib/cloudinary';
import { NEXT_CLOUDINARY_ANALYTICS_ID } from '../../src/constants/analytics';

// Mock console.warn() so we can see when it's called
global.console = {
  ...global.console,
  warn: jest.fn()
}

describe('Cloudinary', () => {
  afterEach(() => {
    // Clears the state of console.warn, in case multiple tests want to monitor it
    jest.restoreAllMocks()
  });

  describe('constructCloudinaryUrl', () => {
    it('should create a Cloudinary URL', () => {
      const cloudName = 'customtestcloud';
      const url = constructCloudinaryUrl({
        options: {
          src: 'turtle',
          width: 100,
          height: 100
        },
        config: {
          cloud: {
            cloudName
          }
        }
      });
      expect(url).toContain(`https://res.cloudinary.com/${cloudName}/image/upload/c_limit,w_100/f_auto/q_auto/turtle`);
    });

    it('should create a Cloudinary URL with custom quality and format options', () => {
      const format = 'png';
      const quality = 75;
      const cloudName = 'customtestcloud';
      const url = constructCloudinaryUrl({
        options: {
          src: 'turtle',
          width: 100,
          height: 100,
          format,
          quality
        },
        config: {
          cloud: {
            cloudName
          }
        }
      });
      expect(url).toContain(`https://res.cloudinary.com/${cloudName}/image/upload/c_limit,w_100/f_${format}/q_${quality}/turtle`);
    });

    it('should include an analytics ID at the end of the URL', () => {
      const cloudName = 'customtestcloud';
      const url = constructCloudinaryUrl({
        options: {
          src: 'turtle',
        },
        config: {
          cloud: {
            cloudName
          }
        }
      });
      // Only match the analytics version (A) and the ID as the rest is determined
      // dynamically by SDK and Next.js version
      expect(url).toContain(`?_a=A${NEXT_CLOUDINARY_ANALYTICS_ID}`);
    });
  });

  describe('getPublicId', () => {
    it('Just returns a non-Cloudinary url', () => {
      const src = 'https://google.com';
      expect(getPublicId(src)).toBe(src)
    });

    it('Just returns the public ID of a Cloudinary URL 1 folder deep', () => {
      const publicId = 'turtle';
      const src = `https://res.cloudinary.com/test-cloud/image/upload/c_limit,w_960/f_auto/q_auto/v1/${publicId}`;
      expect(getPublicId(src)).toBe(publicId);
    });

    it('Just returns the public ID of a Cloudinary URL 1 folder deep', () => {
      const publicId = 'images/turtle';
      const src = `https://res.cloudinary.com/test-cloud/image/upload/c_limit,w_960/f_auto/q_auto/v1/${publicId}`;
      expect(getPublicId(src)).toBe(publicId);
    });

    it('Just returns the public ID of a Cloudinary URL 2 folders deep', () => {
      const publicId = 'app/images/turtle';
      const src = `https://res.cloudinary.com/test-cloud/image/upload/c_limit,w_960/f_auto/q_auto/v1/${publicId}`;
      expect(getPublicId(src)).toBe(publicId);
    });

    it('Returns invalid Cloudinary url with a warning', () => {
      const src = 'https://res.cloudinary.com';
      expect(getPublicId(src)).toBe(src)
      expect(console.warn)
        .toBeCalledWith(`Not possible to retrieve the publicUrl from ${src}, make sure it's a valid cloudinary image url.`)
    });
  });

  describe('createPlaceholderUrl', () => {
    it('should create a placeholder URL with default settings', () => {
      const cloudName = 'customtestcloud';
      const url = createPlaceholderUrl({
        src: 'turtle',
        config: {
          cloud: {
            cloudName
          }
        }
      });
      expect(url).toContain(`https://res.cloudinary.com/${cloudName}/image/upload/c_limit,w_100/f_auto/q_1/turtle`);
    });

    it('should create a placeholder URL in grayscale', () => {
      const cloudName = 'customtestcloud';
      const url = createPlaceholderUrl({
        src: 'turtle',
        placeholder: 'grayscale',
        config: {
          cloud: {
            cloudName
          }
        }
      });
      expect(url).toContain(`https://res.cloudinary.com/${cloudName}/image/upload/c_limit,w_100/e_grayscale/f_auto/q_1/turtle`);
    });

    it('should create a placeholder URL with a color', () => {
      const cloudName = 'customtestcloud';
      const url = createPlaceholderUrl({
        src: 'turtle',
        placeholder: 'color:blueviolet',
        config: {
          cloud: {
            cloudName
          }
        }
      });
      expect(url).toContain(`https://res.cloudinary.com/${cloudName}/image/upload/c_limit,w_100/e_grayscale/e_colorize:60,co_blueviolet/f_auto/q_1/turtle`);
    });
  });
})
