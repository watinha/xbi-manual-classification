import arff, np, sys

from PIL import Image
from scipy.stats import wasserstein_distance
from matplotlib.pyplot import imread
from skimage.metrics import normalized_root_mse, peak_signal_noise_ratio, structural_similarity
from skimage.transform import resize

if (len(sys.argv) < 2):
    print('Hou pass a arff file as argument...')
    sys.exit(1)

arff_file = sys.argv[1]
dataset = arff.load(open(arff_file))
attributes = [attribute[0] for attribute in dataset['attributes']]

dataset['attributes'] = dataset['attributes'] + [
    ('emd', 'NUMERIC'), ('ssim', 'NUMERIC'),
    ('mse', 'NUMERIC'), ('psnr', 'NUMERIC')
]

for row in dataset['data']:
    base_hist = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
    target_hist = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
    emd = -1
    ssim = -1
    mse = -1
    psnr = -1

    base_path = row[attributes.index('baseScreenshot')]
    target_path = row[attributes.index('targetScreenshot')]
    base_platform = row[attributes.index('basePlatform')]
    target_platform = row[attributes.index('targetPlatform')]

    if row[attributes.index('childsNumber')] == 0.0 and base_platform != 'null' and target_platform != 'null' and not base_path.endswith('/null') and not target_path.endswith('/null'):
        print('Getting -> ./public/%s -> extracting... -> ./public/%s' % (base_path, target_path))

        base_img = Image.open('./public/%s' % (base_path)).convert('L')
        target_img = Image.open('./public/%s' % (target_path)).convert('L')

        base_hist = np.histogram(base_img.histogram())[0].tolist()
        target_hist = np.histogram(target_img.histogram())[0].tolist()

        base_scipy_img = imread('./public/%s' % (base_path))
        target_scipy_img = imread('./public/%s' % (target_path))
        target_scipy_img = resize(target_scipy_img, base_scipy_img.shape, anti_aliasing=True)

        emd = wasserstein_distance(base_hist, target_hist)
        try:
            ssim = structural_similarity(base_scipy_img, target_scipy_img, full=True, multichannel=True)[0]
        except:
            ssim = 1
        mse = normalized_root_mse(base_scipy_img, target_scipy_img)
        psnr = peak_signal_noise_ratio(base_scipy_img, target_scipy_img)

        print('Result - EMD: %f, SSIM: %f, MSE: %f e PSNR: %f' % (emd, ssim, mse, psnr))

    row += [ emd, ssim, mse, psnr ]

arff.dump(dataset, open(arff_file.replace('.arff', '.img.arff'), 'w'))
