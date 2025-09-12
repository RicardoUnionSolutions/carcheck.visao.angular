import { Component, OnInit, ElementRef, Input } from '@angular/core';
import { ModalService } from '../../service/modal.service';

@Component({
    selector: 'ck-loading',
    templateUrl: './ck-loading.component.html',
    styleUrls: ['./ck-loading.component.scss']
})
export class CkLoadingComponent implements OnInit {
    @Input() id: string;
    element: any;
    msg = { status: '', title: '', text: '' };
    constructor(private modalService: ModalService, private el: ElementRef) {
        this.element = this.el.nativeElement;
        this.modalService.getMsg().subscribe(v => { this.msg = v });
    }

    ngOnInit(): void {
        let modal = this;
        // ensure id attribute exists
        if (!this.id) {
            console.error('modal must have an id');
            return;
        }

        // move element to bottom of page (just before </body>) so it can be displayed above everything else
        document.body.appendChild(this.element);

        // close modal on background click
        /*this.element.addEventListener('click', function (e: any) {
            if (e.target.className === 'ck-modal') {
                modal.close();
            }
        });*/

        // add self (this modal instance) to the modal service so it's accessible from controllers
        this.modalService.add(this);

    }

    // remove self from modal service when directive is destroyed
    ngOnDestroy(): void {
        this.modalService.remove(this.id);
        this.element.remove();
    }

    // open modal
    open(): void {
        this.element.style.display = 'block';
        document.body.classList.add('ck-modal-open');
    }

    // close modal
    close(): void {
        this.element.style.display = 'none';
        document.body.classList.remove('ck-modal-open');
    }

}
