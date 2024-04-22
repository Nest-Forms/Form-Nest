#/bin/bash
folderToIgnore=$1

echo "=============== list modified files ==============="
git diff --name-only HEAD^ HEAD

echo "========== check paths of modified files =========="
git diff --name-only HEAD^ HEAD &gt; files.txt
while IFS= read -r file
do
echo $file
if [[ $file != $folderToIgnore/* ]]; then
    echo "This modified file is not under the '$folderToIgnore' folder."
    echo "::set-output name=run_job::false"
    break
else
    echo "::set-output name=run_job::true"
fi
done &lt; files.txt