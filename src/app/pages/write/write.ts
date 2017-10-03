import { Component, ViewChild, OnDestroy } from '@angular/core';
import { AppService } from './../../providers/app.service';
import { PostCreateComponent } from '../../../angular-xapi/components/post-create/post-create';
import { SimpleTinyComponent } from './simple-tiny';

const spawn = require('child_process').spawn;



@Component({
    selector: 'write-page',
    templateUrl: 'write.html'
})
export class WritePage implements OnDestroy {
    @ViewChild('postCreateComponent') postCreateComponent: PostCreateComponent;
    @ViewChild('tiny') tiny: SimpleTinyComponent;

    sites;
    sitesOn;
    results = {};

    autoPostingProcessMessage = {};
    autoPostingProcessLoader = {};

    showBrowser = false;

    constructor(
        public app: AppService
    ) {
        console.log("write page: server url: ", app.xapi.getServerUrl());

        app.xapi.version().subscribe(re => console.log('version: ', re));

        if (app.user.isLogin) {
            this.sitesOn = app.referenceSite().on('value', snap => {
                if (snap.val()) {
                    const obj = snap.val();
                    this.sites = [];
                    for (const k of Object.keys(obj)) {
                        this.sites.push({ key: k, value: obj[k].split('/').map(x => x.trim()) });
                    }
                }
            });
        }
        // this.autoPosting( 'jjjo@adwriter_com', '-KvI63YLMcjKNL_3McAC' );
    }

    ngOnDestroy() {
        if ( this.sitesOn ) this.app.referenceSite().off('value', this.sitesOn);
    }

    // tinyMceKeyup(content) {
    //     this.postCreateComponent.post_content = content;
    // }

    get self(): WritePage {
        return this;
    }
    hookPostCreate(event) {
        if (event.action === 'submit') {
            let content = this.tiny.editor.getContent();
            this.postCreateComponent.post_content = content;
        }
        else if (event.action === 'file-uploaded') {
            console.log("File uploaded: ", event.file);
            tinymce.activeEditor.insertContent('<img style="max-width: 100%; height: auto;" src="' + event.file.url + '"/>');
        }
    }
    async onPostCreatSuccess(post_id) {
        const c = this.postCreateComponent;
        console.log(`WritePage::onPostCreateSuccess ${post_id}`);
        // console.log('title: ', c.post_title);



        let data = {
            title: c.post_title ? c.post_title : '',
            content: this.tiny.editor.getContent(),
            files: c.files
        };

        console.log("data: ", data);
        const push = this.app.db.child('ad-write').child(this.app.userId).push();
        const key = push.key;
        await push.set(data);

        console.log("finished push: key: ", key);


        // console.log("sites: ", this.results);

        this.autoPosting(this.app.userId, key);

    }



    autoPosting(user, key) {


        this.autoPostingProcessMessage = {};
        this.autoPostingProcessLoader = {};

        for (const name of Object.keys(this.results)) {
            if (this.results[name]) {

                console.log('name: ', name);
                let info = this.sites.find(x => x.key === name).value;
                console.log('info: ', info);

                const script = info[1];
                const category = info[2];
                const id = info[3];
                const password = info[4];


                console.log("base path: ", window['appPath']);

                this.fork(script, name, user, key, category, id, password);

            }
        }


    }

    fork(script, pid, user, key, category, id, password) {

        const $params = [`auto-post/dist/src/task/${script}.js`,
        `--user=${user}`,
        `--key=${key}`,
        `--category=${category}`,
        `--id=${id}`,
        `--password=${password}`,
        `--pid=${pid}`,
        `--browser=${this.showBrowser}`
        ];
        console.log("node " + $params.join(' '));
        const ls = spawn('node', $params);
        this.autoPostingProcessLoader[pid] = 0;
        this.autoPostingProcessMessage[pid] = 'preparing';
        this.app.render();
        console.log("loader: ", this.autoPostingProcessLoader);
        ls.stdout.on('data', (data) => {
            let arr = data.toString().split('=');
            let pid = arr[0];
            let re = arr[1].trim();
            this.autoPostingProcessMessage[arr[0]] = re;

            if (re === 'success:') {
                this.autoPostingProcessLoader[pid] = 1;
                console.log("success: pid: ", this.autoPostingProcessLoader);
            }
            this.app.render(100);
        });
        ls.stderr.on('data', (data) => {
            console.log(`ERROR: ${data}`);
            let errstr = data.toString();
            if (errstr.indexOf('Cannot find module')) {
                this.autoPostingProcessMessage[pid] = `Error: cannot find ${script} script.`;
            }
            else {
                this.autoPostingProcessMessage[pid] = `Error: process error.`;
            }
            this.autoPostingProcessLoader[pid] = 2;
            console.log("success: pid: ", this.autoPostingProcessLoader);
            this.app.render(100);

        });
        ls.on('close', (code) => {
            console.log(`child process exited with code ${code}`);
        });
    }
}
