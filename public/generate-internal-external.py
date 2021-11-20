import arff, np, sys, math

if (len(sys.argv) < 2):
    print('Hou pass a arff file as argument...')
    sys.exit(1)

arff_file = sys.argv[1]
dataset = arff.load(open(arff_file))
attributes = [attribute[0] for attribute in dataset['attributes']]

filtered = []
structure_xbis = []
for row in dataset['data']:
    if row[attributes.index('targetPlatform')] == 'null' or row[attributes.index('basePlatform')] == 'null':
        structure_xbis.append(row)
    else:
        filtered.append(row)

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
