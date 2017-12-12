# RTÉ Investigates: Law & Disorder
## A Data visualisation piece for RTÉ Investigates

You can view the project live [here](https://www.rte.ie/iu/courts/)

###How it was built

*Data*

Data was initially given as a single XLS file. This file was split into multiple districts sheets and exported to CSV. Finally these CSV files were onverted to JSON using an online tool.

*Map*

We got the svg paths from the official courts website and grouped area into their correct districts using Sketch, this was done to match how the data was presented.

Each district grouping was named to match the corresponding JSON file and we added the NI border.

The map interactivity is simple CSS & JS.

*Charts*

THe charts were generated using Billboard.js which used D3.js

*Table*

The table is simply generated with JS

*Mobile*

The webapp is split into 2 columns. On mobile we floated the right column over the map when the user tapped a district. We added an X button for easy navigation back to the map.
 
### Issues

SVG map is very big, file size could be reduced.
SVG map is embedded in the page. Would be better to use D3 to render it.
Mobile/Dekstop content differs, this could be handled better

 




