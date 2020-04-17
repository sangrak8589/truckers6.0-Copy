import { Component, OnInit, OnDestroy } from "@angular/core";
import { Subscription } from 'rxjs';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { AuthService } from 'src/app/auth/auth.service';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { UserCompaniesService } from '../user-company.service';
import { UserCompanyRelation } from '../user-company.model';
import { AuthData } from 'src/app/auth/auth-data.model';

export interface Operator {
    operator: string;
}

@Component({
    selector: "app-update-points",
    templateUrl: './update-points.component.html',
    styleUrls: ['./update-points.component.html']
})
export class UpdatePointsComponent implements OnInit, OnDestroy {
    isLoading = false;
    private authStatusSub: Subscription;
    private relationSub: Subscription;
    private relationId;
    private pointValue = null;
    relation: UserCompanyRelation;
    private userEmail;
    form: FormGroup;
    operators: Operator[] = [
        {operator: '+'},
        {operator: '-'}
    ];

    constructor(public authService: AuthService,
                public route: ActivatedRoute,
                public userCompaniesService: UserCompaniesService) {}

    ngOnInit() {
        this.authStatusSub = this.authService.getAuthStatusListener()
            .subscribe( authStatus => {
                this.isLoading = false;
            });
        
        this.form = new FormGroup({
            'plusminus': new FormControl(null, {
                validators: [Validators.required]
            }),
            'pointValue': new FormControl(null, {
                validators: [Validators.required]
            })
        })
        this.route.paramMap.subscribe((paramMap: ParamMap) => {
            if (paramMap.has('relationId')){
                this.relationId = paramMap.get('relationId');
                this.isLoading = true;
                this.userCompaniesService.getRelation(this.relationId).subscribe(relationData => {
                    this.isLoading = false;
                    this.relation = {
                        id: relationData._id,
                        userId: relationData.userId,
                        companyId: relationData.companyId,
                        userName: relationData.userName,
                        companyName: relationData.companyName,
                        points: relationData.points
                    };
                })
            }
        })
    }

    ngOnDestroy() {
        this.authStatusSub.unsubscribe();
    }

    onUpdatePoints() {
        if (this.form.invalid)
            return;

        if (this.form.value.plusminus === "+")
            this.pointValue = this.relation.points + this.form.value.pointValue;
        else
            this.pointValue = this.relation.points + (this.form.value.pointValue * -1);

        if (this.pointValue < 0)
            this.pointValue = 0;

        this.authService.getUser(this.relation.userId)
            .subscribe(user => {
                this.userEmail = user.email;
                this.userCompaniesService.updatePoints(
                    this.relation.id,
                    this.relation.userId,
                    this.relation.companyId,
                    this.relation.userName,
                    this.relation.companyName,
                    this.pointValue,
                    this.userEmail
                )
            });
    }
}