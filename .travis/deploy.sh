#!/bin/bash

eval "$(ssh-agent -s)" # Start ssh-agent cache
chmod 600 .travis/id_rsa # Allow read access to the private key
ssh-add .travis/id_rsa # Add the private key to SSH
echo $(pwd)
git config --global push.default matching
git remote add deploy ssh://travis@$IP:$PORT$DEPLOY_DIR
git push deploy master

# Skip this command if you don't need to execute any additional commands after deploying.
ssh travis@$IP -p $PORT <<EOF
  cd $DEPLOY_DIR
  echo $(pwd)
  git pull
  echo ">>> git pull"
  npm i
  echo ">>> npm i"
  echo "Completed deployment."
EOF
