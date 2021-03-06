import {
    Component,
    OnDestroy,
    AfterViewInit,
    EventEmitter,
    Input,
    Output
} from '@angular/core';

@Component({
    selector: 'simple-tiny',
    template: `<textarea id="{{elementId}}"></textarea>`
})
export class SimpleTinyComponent implements AfterViewInit, OnDestroy {
    @Input() elementId: String;
    @Output() onEditorKeyup = new EventEmitter<any>();

    editor;

    ngAfterViewInit() {
        tinymce.init({
            selector: '#' + this.elementId,
            plugins: ['link', 'paste', 'table', 'textcolor'],
            toolbar: "undo redo | styleselect | bold italic | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent link paste forecolor backcolor",
            skin_url: 'assets/skins/lightgray',
            height: 500,
            setup: editor => {
                this.editor = editor;
                // editor.on('keyup', () => {
                //     const content = editor.getContent();
                //     this.onEditorKeyup.emit(content);
                // });
            },
        });
    }

    ngOnDestroy() {
        tinymce.remove(this.editor);
    }
}
