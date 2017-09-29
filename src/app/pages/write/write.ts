import { Component } from '@angular/core';
import { XapiService, ForumService } from '../../../angular-xapi/angular-xapi-service.module';

@Component({
    selector: 'write-page',
    templateUrl: 'write.html'
})
export class WritePage {
    constructor(
        private x: XapiService,
        private forum: ForumService
    ) {
        console.log("write page: server url: ", x.getServerUrl());

        x.version().subscribe( re => console.log('version: ', re));
    }


    
}
