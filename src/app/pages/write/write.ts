import { Component, ViewChild } from '@angular/core';
import { AppService } from './../../providers/app.service';
import { PostCreateComponent } from '../../../angular-xapi/components/post-create/post-create';

const spawn = require('child_process').spawn;



@Component({
    selector: 'write-page',
    templateUrl: 'write.html'
})
export class WritePage {
    @ViewChild('postCreateComponent') postCreateComponent: PostCreateComponent;
    constructor(
        public app: AppService
    ) {
        console.log("write page: server url: ", app.xapi.getServerUrl());

        app.xapi.version().subscribe(re => console.log('version: ', re));

        this.autoPosting( 'jjjo@adwriter_com', '-KvI63YLMcjKNL_3McAC' );
    }

    async onPostCreatSuccess(post_id) {
        const c = this.postCreateComponent;
        console.log(`WritePage::onPostCreateSuccess ${post_id}`);
        console.log('title: ', c.post_title);

        let data = {
            title: c.post_title,
            content: c.post_content,
            files: c.files
        };

        const push = this.app.db.child('ad-write').child(this.app.userId).push();
        const key = push.key;
        await push.set(data);

        console.log("finished push: key: ", key);

        this.autoPosting(this.app.userId, key);

    }



    autoPosting(user, key) {

        
        console.log("base path: ", window['appPath']);


        const ls = spawn('node', [`auto-post/dist/src/task/sonub.js`, `--user=${user}`, `--key=${key}`]);
        ls.stdout.on('data', (data) => {
            console.log(`${data}`);
        });
        ls.stderr.on('data', (data) => {
            console.log(`${data}`);
        });
        ls.on('close', (code) => {
            console.log(`child process exited with code ${code}`);
        });

    }
}
