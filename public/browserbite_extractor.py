import arff, np, sys, math

from PIL import Image

if (len(sys.argv) < 2):
    print('Hou pass a arff file as argument...')
    sys.exit(1)

arff_file = sys.argv[1]
dataset = arff.load(open(arff_file))
attributes = [attribute[0] for attribute in dataset['attributes']]

dataset['attributes'] = dataset['attributes'] + [
    ('base_bin1', 'NUMERIC'),
    ('base_bin2', 'NUMERIC'),
    ('base_bin3', 'NUMERIC'),
    ('base_bin4', 'NUMERIC'),
    ('base_bin5', 'NUMERIC'),
    ('base_bin6', 'NUMERIC'),
    ('base_bin7', 'NUMERIC'),
    ('base_bin8', 'NUMERIC'),
    ('base_bin9', 'NUMERIC'),
    ('base_bin10', 'NUMERIC'),
    ('target_bin1', 'NUMERIC'),
    ('target_bin2', 'NUMERIC'),
    ('target_bin3', 'NUMERIC'),
    ('target_bin4', 'NUMERIC'),
    ('target_bin5', 'NUMERIC'),
    ('target_bin6', 'NUMERIC'),
    ('target_bin7', 'NUMERIC'),
    ('target_bin8', 'NUMERIC'),
    ('target_bin9', 'NUMERIC'),
    ('target_bin10', 'NUMERIC'),
    ('diff_bin01', 'NUMERIC'),
    ('diff_bin02', 'NUMERIC'),
    ('diff_bin03', 'NUMERIC'),
    ('diff_bin04', 'NUMERIC'),
    ('diff_bin05', 'NUMERIC'),
    ('diff_bin11', 'NUMERIC'),
    ('diff_bin12', 'NUMERIC'),
    ('diff_bin13', 'NUMERIC'),
    ('diff_bin14', 'NUMERIC'),
    ('diff_bin15', 'NUMERIC'),
    ('diff_bin21', 'NUMERIC'),
    ('diff_bin22', 'NUMERIC'),
    ('diff_bin23', 'NUMERIC'),
    ('diff_bin24', 'NUMERIC'),
    ('diff_bin25', 'NUMERIC'),
    ('diff_bin31', 'NUMERIC'),
    ('diff_bin32', 'NUMERIC'),
    ('diff_bin33', 'NUMERIC'),
    ('diff_bin34', 'NUMERIC'),
    ('diff_bin35', 'NUMERIC'),
    ('diff_bin41', 'NUMERIC'),
    ('diff_bin42', 'NUMERIC'),
    ('diff_bin43', 'NUMERIC'),
    ('diff_bin44', 'NUMERIC'),
    ('diff_bin45', 'NUMERIC'),
    ('sdd', 'NUMERIC'),
    ('ncc', 'NUMERIC')
]

for row in dataset['data']:
    base_hist = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
    target_hist = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
    diff = [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]

    base_path = row[attributes.index('baseScreenshot')]
    target_path = row[attributes.index('targetScreenshot')]

    if row[attributes.index('childsNumber')] == 0.0 and target_path != 'null' and base_path != 'null':
        base_img = Image.open('%s' % (base_path)).convert('L')
        target_img = Image.open('.%s' % (target_path)).convert('L')
        base_hist = np.histogram(base_img.histogram())[0].tolist()
        target_hist = np.histogram(target_img.histogram())[0].tolist()

        width = min(base_img.size[0], target_img.size[0])
        height = min(base_img.size[1], target_img.size[1])
        comp_img = target_img.crop((0, 0, width, height))
        diff_img = Image.new('RGBA', (width, height), (0, 0, 0, 0))

        sdd = 0
        ncc = 0
        ncc_div1 = 0
        ncc_div2 = 0
        for i in range(width):
            for j in range(height):
                pixel_i1 = base_img.getpixel((i, j))
                pixel_i2 = comp_img.getpixel((i, j))
                if pixel_i1 != pixel_i2:
                    diff_img.putpixel((i,j), (abs(pixel_i1 - pixel_i2), 0, 0, 255))
                diff = pixel_i1 - pixel_i2
                sdd = sdd + (diff * diff)

                pixel_i1 = pixel_i1 + 1
                pixel_i2 = pixel_i2 + 1
                ncc = ncc + pixel_i1 * pixel_i2
                ncc_div1 = ncc_div1 + pixel_i1**2
                ncc_div2 = ncc_div2 + pixel_i2**2

        if (ncc_div1 == 0 and ncc_div2 == 0):
            ncc = 1
        else:
            ncc = ncc / math.sqrt(ncc_div1 * ncc_div2)

        dim = 5
        diff_img = diff_img.resize((dim, dim)).convert('L')
        diff = []
        for i in range(dim):
            for j in range(dim):
                diff.append(diff_img.getpixel((i, j)))

    row += base_hist + target_hist + diff + [sdd, ncc]

arff.dump(dataset, open(arff_file.replace('.arff', '.hist.arff'), 'w'))
