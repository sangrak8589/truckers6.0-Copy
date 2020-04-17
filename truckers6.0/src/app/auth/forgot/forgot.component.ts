import { Component, OnInit, OnDestroy } from "@angular/core";
import { AuthService } from '../auth.service';
import { Subscription } from 'rxjs';
import { NgForm } from '@angular/forms';

@Component({
    selector: 'app-forgot',
    templateUrl: './forgot.component.html',
    styleUrls: ['./forgot.component.css']
})
export class ForgotComponent implements OnInit, OnDestroy{
    isLoading = false;
    private authStatusSub: Subscription;

    constructor(public authService: AuthService) {}

    ngOnInit() {
        this.authStatusSub = this.authService.getAuthStatusListener()
            .subscribe(authStatus => {
                this.isLoading = false;
            });
    }

    ngOnDestroy() {
        this.authStatusSub.unsubscribe();
    }

    onResetPassword(form: NgForm) {
        if (form.invalid)
            return;
        
            this.isLoading = true;
            this.authService.resetPassword(form.value.email, form.value.username, form.value.password);
    }
}