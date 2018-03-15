## blog base on Hexo

I have faced a issue that once i change a computer, the source code was on my previous computer and i just have the deployed code. It's very inconvenient.
so i create two branth.
____
**hexo: for source code of my blog**
git
**master: also the default branch for deploy my blog**
_____

### how to deploy 

1. git clone https://github.com/gycdgg/gycdgg.github.io.git
2. git checkout hexo  // **switch to hexo branch**
3. npm i              // make sure you have installed node.js and npm
4. npm run dev        // write your blog locally,hot load supported, server listening at localhost:4000
5. npm run deploy     // deploy your blog.

>For the step 5, you should so some preparation.
change the git repo to your own repository.
```yml

deploy:
  type: git
  repo: git@github.com:gycdgg/gycdgg.github.io.git # change this to your own repository after you have create this repostory
  branch: master

```
*If you have any questions or require more information, please feel free to contact me.*