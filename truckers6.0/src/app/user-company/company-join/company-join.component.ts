import { Component, OnInit, OnDestroy } from "@angular/core";
import { Subscription } from 'rxjs';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Company } from '../../company/company.model';
import { AuthService } from 'src/app/auth/auth.service';
import { ActivatedRoute } from '@angular/router';
import { CompaniesService } from '../../company/company.service';
import { UserCompaniesService } from '../user-company.service';
import { AuthData } from 'src/app/auth/auth-data.model';


@Component({
    selector: 'app-company-join',
    templateUrl: './company-join.component.html',
    styleUrls: ['./company-join.component.css']
})
export class CompanyJoinComponent implements OnInit, OnDestroy {
    isLoading = false;
    private authStatusSub: Subscription;
    private companiesSub: Subscription;
    private relationStatusSub: Subscription;
    selectedCompany = null;
    selectedCompanyId = null;
    private userId: string;
    private userName: string;
    private userRole: string;
    form: FormGroup;
    private user;

    companies: Company[];
    totalCompanies = 0;

    constructor(public authService: AuthService,
                public route: ActivatedRoute,
                public companiesService: CompaniesService,
                public userCompanyService: UserCompaniesService) {}

    ngOnInit() {
        this.authStatusSub = this.authService.getAuthStatusListener().subscribe(
            authStatus => {
                this.isLoading = false;
            }
        );
        this.relationStatusSub = this.userCompanyService.getRelationStatusListener()
            .subscribe(relationStatus => {
                this.isLoading = false;
            })
        this.companiesService.getAllCompanies();
        this.userId = this.authService.getUserId();
        this.userName = this.authService.getUsername();
        this.authService.getUser(this.userId).subscribe(userData => {
            this.isLoading = false;
            this.user = {
              id: userData._id,
              email: userData.email,
              password: userData.password,
              fname: userData.fname,
              lname: userData.lname,
              username: userData.username,
              role: userData.role
            };
        });
        this.companiesSub = this.companiesService.getCompanyUpdateListener()
            .subscribe((companyData: {companies: Company[], companyCount: number}) => {
                this.isLoading = false;
                this.companies = companyData.companies;
                this.totalCompanies = companyData.companyCount;
            });
        
        this.form = new FormGroup({
            'company': new FormControl(null, {
                validators: [Validators.required]
            })
        });
    }

    ngOnDestroy() {
        this.authStatusSub.unsubscribe();
    }

    onJoinCompany() {
        if (this.form.invalid)
            return;
        this.isLoading = true;
        this.userRole = this.authService.getUserRole();
        if (this.userRole == "Driver" || this.userRole == "Admin")
            this.userCompanyService.joinCompany(this.userId, this.form.value.company.id, this.userName, this.form.value.company.name, 0, this.user.email);
        if (this.userRole == "Sponsor") {
            console.log(this.user);
            this.authService.updateUser(this.user.id, this.user.email, this.user.password, this.user.fname, this.user.lname, this.user.username, this.user.role, this.form.value.company.id);
         }
         this.form.reset();
    }
}