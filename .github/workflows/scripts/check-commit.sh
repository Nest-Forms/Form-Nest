#/bin/bash
folderToIgnore=$1
GITHUB_SHA=$2

echo folderToIgnore $folderToIgnore
echo GITHUB_SHA $GITHUB_SHA
#git log

#git diff

#echo "::set-output name=files::$(git diff-tree --no-commit-id --name-only -r ${{ github.sha }} | xargs)"
git diff-tree --no-commit-id --name-only -r $GITHUB_SHA | xargs
echo files=$(git diff-tree --no-commit-id --name-only -r $GITHUB_SHA | xargs)
echo $files

# echo "=============== list modified files ==============="
# git diff --name-only HEAD~1 HEAD
# # git diff --name-only HEAD^ HEAD

# echo "========== check paths of modified files =========="
# # git diff --name-only HEAD^ HEAD &gt; files.txt
# git diff --name-only HEAD~1 HEAD > files.txt

# while IFS= read -r file
# do
#     echo $file
#     if [[ $file != $folderToIgnore/* ]]; then
#         echo "This modified file is not under the '$folderToIgnore' folder."
#         run_job=false
#         #echo "::set-output name=run_job::false"
#         break
#     else
#         run_job=true
#         eval "$folderToIgnore=true"
#     fi
# done < files.txt

# echo folderToIgnore $folderToIgnore
# run_job=true
# echo run_job $run_job
export run_job
export files