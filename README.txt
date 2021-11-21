TODO:
- classify elements with no matching element as external XBIs (count structural XBIs)
- change ? -> 0
- separate external and internal xbis dataset (internals should only include comparisons with elements screenshots)

LOG:
- removed websites with infinite scrolling capture issues
- 404 websites
- animated floating menus
- viewport for an specific device issues
- errors while capturing screenshots

TO CLASSIFY:
- run the frontend-dev npm script
- run the backend npm start script

TO GENERATE DATASETS:
- unzip collector files in the public directory
- identify all arff files in an arff txt file
- run scripts/generate_arff
- run scripts/map_elements_outside
- run scripts/browserbite_extractor
- run scripts/image_extractor
- run scripts/generate_internal_external
- all arff files will be generated in the data folder
