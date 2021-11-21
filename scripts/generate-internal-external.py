import arff, np, sys, math

if (len(sys.argv) < 2):
    print('Hou pass a arff file as argument...')
    sys.exit(1)

arff_file = sys.argv[1]
dataset = arff.load(open(arff_file))
attributes = [attribute[0] for attribute in dataset['attributes']]
max_psnr = -1
max_mse = -1

filtered = []
structure_xbis = []
for row in dataset['data']:
    if row[attributes.index('targetPlatform')] == 'null' or row[attributes.index('basePlatform')] == 'null':
        structure_xbis.append(row)
    else:
        psnr = row[attributes.index('psnr')]
        if psnr != float('inf') and psnr > max_psnr:
            max_psnr = psnr
        mse = row[attributes.index('mse')]
        if mse is None:
            mse = -1
            row[attributes.index('mse')] = -1
        if mse != float('inf') and mse > max_mse:
            max_mse = mse
        filtered.append(row)

    if row[attributes.index('internal')] is None:
        print('updating internal from None -> 0: %s' % (row))
        row[attributes.index('internal')] = '0'
    if row[attributes.index('external')] is None:
        print('updating external from None -> 0: %s' % (row))
        row[attributes.index('external')] = '0'


print('Structure XBIs: %d' % (len(structure_xbis)))

internal = []
count_internal = 0
count_external = 0
for row in filtered:
    base_path = row[attributes.index('baseScreenshot')]
    target_path = row[attributes.index('targetScreenshot')]
    target_platform = row[attributes.index('basePlatform')]
    base_platform = row[attributes.index('targetPlatform')]

    if (row[attributes.index('internal')] == '1'): count_internal += 1
    if (row[attributes.index('external')] == '1'): count_external += 1

    psnr = row[attributes.index('psnr')]
    if psnr == float('inf'):
        row[attributes.index('psnr')] = max_psnr
        print('changing psnr from inf -> %d' % (max_psnr))

    mse = row[attributes.index('mse')]
    if mse == float('inf'):
        row[attributes.index('mse')] = max_mse
        print('changing mse from inf -> %d' % (max_mse))


    if row[attributes.index('childsNumber')] == 0.0 and base_platform != 'null' and target_platform != 'null' and not base_path.endswith('/null') and not target_path.endswith('/null'):
        internal.append(row)

print('Internal XBIs: %d (Internal dataset has %d rows)' % (count_internal, len(internal)))
print('External XBIs: %d (External dataset has %d rows)' % (count_external, len(filtered)))

dataset['data'] = structure_xbis
arff.dump(dataset, open(arff_file.replace('.arff', '.structure-xbis.arff'), 'w'))
dataset['data'] = internal
arff.dump(dataset, open(arff_file.replace('.arff', '.internal.arff'), 'w'))
dataset['data'] = filtered
arff.dump(dataset, open(arff_file.replace('.arff', '.external.arff'), 'w'))
