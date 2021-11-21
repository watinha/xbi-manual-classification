import arff

f = open('./scripts/arffs.txt')

filenames = f.read().split('\n')
f.close()

complete_dataset = None

filenames = [filename for filename in filenames if len(filename) > 0]

for filename in filenames:
    dataset = arff.load(open('./public/%s' % (filename)))
    [folder, file_path] = filename.split('results/')

    baseScreenshot_index = dataset['attributes'].index(('baseScreenshot', 'STRING'))
    targetScreenshot_index = dataset['attributes'].index(('targetScreenshot', 'STRING'))
    for row in dataset['data']:
        row[baseScreenshot_index] = ('%s%s' % (folder, row[baseScreenshot_index]))
        row[targetScreenshot_index] = ('%s%s' % (folder, row[targetScreenshot_index]))

    if complete_dataset is None:
        complete_dataset = dataset
    else:
        complete_dataset['data'] += dataset['data']

new_f = open('./data/dataset.unclassified.arff', 'wt')
new_f.write(arff.dumps(complete_dataset))
new_f.close()
