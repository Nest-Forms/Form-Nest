#/bin/bash
folderToIgnore=$1

echo folderToIgnore $folderToIgnore

echo "=============== list modified files ==============="
git diff --name-only HEAD~1 HEAD
# git diff --name-only HEAD^ HEAD

echo "========== check paths of modified files =========="
# git diff --name-only HEAD^ HEAD &gt; files.txt
git diff --name-only HEAD~1 HEAD > files.txt

while IFS= read -r file
do
    echo $file
    if [[ $file != $folderToIgnore/* ]]; then
        echo "This modified file is not under the '$folderToIgnore' folder."
        eval "$folderToIgnore=false"
        #echo "::set-output name=run_job::false"
        break
    else
        #echo "::set-output name=run_job::true"
        eval "$folderToIgnore=true"
    fi
done < files.txt

echo folderToIgnore $folderToIgnore

export $folderToIgnore