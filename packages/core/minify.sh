#!/bin/bash
set -eux

js_files_name="$(paste -s -d "\n" <(ls build/*.js | xargs -I {} basename {} .js))"
echo "${js_files_name}" | xargs -I {} terser --compress -o build/{}.min.js -- build/{}.js

echo "${js_files_name}" | xargs -I {} mv -f build/{}.min.js build/{}.js