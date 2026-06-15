import {
  AfterContentChecked,
  AfterViewInit,
  Component,
  DestroyRef,
  inject,
  OnInit,
  signal,
  WritableSignal,
} from '@angular/core';
import { RouterOutlet, RouterModule, Router } from '@angular/router';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { UsersService } from './Services/users.service';
import { jwtDecode } from 'jwt-decode';
import { AuthServiceService } from './Services/auth-service.service';
import { DatePipe, NgOptimizedImage, NgStyle } from '@angular/common';
import { FooterComponent } from './Components/footer/footer.component';
import { ChatService } from './Services/chat.service';
import { JobPostingService } from './Services/job-posting.service';
import { MatButtonModule } from '@angular/material/button';
import { PaymentService } from './Services/payment.service';
import Swal from 'sweetalert2';
import { MessagesInterface } from '../models/messages-interface';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { switchMap } from 'rxjs';
import { NgxSpinnerComponent } from 'ngx-spinner';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,
    HttpClientModule,
    RouterModule,
    NgStyle,
    NgOptimizedImage,
    FooterComponent,
    MatButtonModule,
    DatePipe,
    NgxSpinnerComponent
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent implements OnInit {
  title = 'QuickBuck';
  constructor(
    private _userService: UsersService,
    private _authService: AuthServiceService,
    private _chatService: ChatService,
    private _jobPostingService: JobPostingService,
    private _router: Router,
    private _paymentService: PaymentService,
  ) {}
  private destroy = inject(DestroyRef);
  // ngAfterViewInit(): void {
  //   if (localStorage.getItem('Token') != null) {
  //     this.Token.set(jwtDecode(localStorage.getItem('Token')!));
  //   } else if (
  //     localStorage.getItem('Token') == null ||
  //     localStorage.getItem('Token') == ''
  //   ) {
  //     this.Token.set( null);
  //   }
  //   console.log(this.Token());
  // }
  ngAfterContentChecked():void{
      const receivedToken =signal<any>( localStorage.getItem('Token'));
    if (receivedToken()) {
      this.Token.set(jwtDecode(receivedToken()));
    } else {
      this.Token.set(null);
    }
  }
  User: any;
  Token: WritableSignal<any> = signal<any>('');
  UserInfo: WritableSignal<any> = signal<any>('');
  Id: WritableSignal<number> = signal<number>(0);
  Messages: WritableSignal<MessagesInterface[]> = signal<MessagesInterface[]>(
    [],
  );
  Count: number = 0;
  BookMarks: any;
  ngOnInit(): void {
    const receivedToken =signal<any>( localStorage.getItem('Token'));
    if (receivedToken()) {
      this.Token.set(jwtDecode(receivedToken()));
    } else {
      this.Token.set(null);
    }

    this._userService.CurrentUser.pipe(
      takeUntilDestroyed(this.destroy),
    ).subscribe({
      next: (data) => {
        this.UserInfo.set(data);
      },
    });
    this._authService.CurrentUserInfo.pipe(
      takeUntilDestroyed(this.destroy),
    ).subscribe({
      next: (data) => {
        console.log(data);

        this.UserInfo.set(data);
      },
    });

    this._authService.CurrentId.pipe(
      takeUntilDestroyed(this.destroy),
    ).subscribe({
      next: (data) => {
        console.log(data);
        this.Id.set(data);
      },
    });
    if (localStorage.getItem('Token') != null) {
      this.Token.set(jwtDecode(localStorage.getItem('Token')!));

      if (this.Token().sub == 'JobSeeker') {
        this._userService
          .GetJobSeekerByUserName(this.Token().name)
          .pipe(takeUntilDestroyed(this.destroy))
          .subscribe({
            next: (data) => {
              console.log(data);
              this.UserInfo.set(data);
              console.log(this.UserInfo());
              this.Id.set(data.id);
              this._authService.updateId(data.id);
              console.log(this.Id());


            },
          })

      } else {
        this._userService
          .GetJobProviderByIdOrByUserName('', this.Token().name)
          .pipe(takeUntilDestroyed(this.destroy))
          .subscribe({
            next: (data) => {
              console.log(data);

              this.UserInfo.set(data);

              this.Id.set(data.id);
              this._authService.updateId(data.id);

            },
          });
      }
    }
  }
  signOut(): void {
    localStorage.removeItem('Token')
    this.Token.set(null);
  }
  openBookmarks(JobSeekerId: number): void {
    this._jobPostingService
      .getBookmarksByJobSeekerId(JobSeekerId)
      .pipe(takeUntilDestroyed(this.destroy))
      .subscribe({
        next: (data) => {
          console.log(data);
          this.Count = data.length;
          this.BookMarks = data;
        },
        error: (err) => {
          console.log(err);
        },
      });
  }
  openBookmarkPage(JobPostId: number): void {
    this._router.navigate([`/Bookmark/${JobPostId}`]);
  }
  OpenLatestMessages(): void {
    console.log(this.Id());

    if (this.Token().sub == 'JobSeeker') {
      this._chatService
        .getMessagesByJobSeekerId(this.Id(), '')
        .pipe(takeUntilDestroyed(this.destroy))
        .subscribe({
          next: (data) => {
            console.log(data);
            this.Messages.set(data);
          },
          error: (err) => {
            console.log(err);
          },
        });
    } else if (this.Token().sub == 'JobProvider') {
      this._chatService
        .getMessagesByJobSeekerId(0, this.Id())
        .pipe(takeUntilDestroyed(this.destroy))
        .subscribe({
          next: (data) => {
            console.log(data);
            this.Messages.set(data);
          },
          error: (err) => {
            console.log(err);
          },
        });
    }
  }
  PayForCharge(Balance: number) {
    localStorage.setItem('PaymentType', 'Sub');
    let PaymentType = localStorage.getItem('PaymentType');
    console.log(PaymentType);
    let User: any;
    if (this.Token().sub == 'JobSeeker') {
      this._userService
        .GetJobSeekerByUserName(this.Token().name)
        .pipe(
          takeUntilDestroyed(this.destroy),
          switchMap((data) => {
            console.log(data);
            User = data;
            return this._paymentService.createOrUpdatePaymentIntent(
              User.wallet.id,
              Balance,
            );
          }),
        )
        .subscribe({
          next: (data) => {
            console.log(data);
            localStorage.setItem('PaymentIntentId', data.paymentIntentId);
            localStorage.setItem('ClientSecret', data.clientSecret);
            localStorage.setItem('Balance', JSON.stringify(Balance));
            if (User.wallet.balance >= Balance) {
              this._router.navigate(['/Checkout']);
            } else {
              Swal.fire({
                title: 'Not Enough Balance',
                icon: 'warning',
              });
            }
          },
          error: (err) => {
            console.log(err);
          },
        });
    } else if (this.Token().sub == 'JobProvider') {
      this._userService
        .GetJobProviderByIdOrByUserName('', this.Token().name)
        .pipe(
          takeUntilDestroyed(this.destroy),
          switchMap((data) => {
            console.log(data);
            User = data;
            return this._paymentService.createOrUpdatePaymentIntent(
              User.wallet.id,
              Balance,
            );
          }),
        )
        .subscribe({
          next: (data) => {
            console.log(data);
            localStorage.setItem('PaymentIntentId', data.paymentIntentId);
            localStorage.setItem('ClientSecret', data.clientSecret);
            localStorage.setItem('Balance', JSON.stringify(Balance));
            if (User.wallet.balance >= Balance) {
              this._router.navigate(['/Checkout']);
            } else {
              Swal.fire({
                title: 'Not Enough Balance',
                icon: 'warning',
              });
            }
          },
        });
    }
  }
  // OpenMessages
  // ------------------------------------------------------------
  openMessage(id: number): void {
    console.log(id);
    if (this.Token().sub == 'JobSeeker') {
      this._userService.GetJobProviderByIdOrByUserName(id, '').pipe(takeUntilDestroyed(this.destroy)).subscribe({
        next: (data) => {
          console.log(data);
          localStorage.setItem('JobProviderId', JSON.stringify(id));
        },
      });

      this._userService
        .GetJobSeekerByUserName(this.Token().name)
        .pipe(takeUntilDestroyed(this.destroy))
        .subscribe({
          next: (data) => {
            console.log(data);
            this._userService.GetJobSeekerById(data.id).subscribe({
              next: () => {
                this._chatService.jobSeekerId = data.id;
                console.log(this._chatService.jobSeekerId);
                localStorage.setItem('JobSeekerId', JSON.stringify(data.id));
                let x: any = localStorage.getItem('JobSeekerId');
                let result = JSON.parse(x);
                console.log(result);
                this._authService.updateJobSeekerId(result);
              },
            });
          },
        });
    }
    this._router.navigate(['/chat']);
  }
  // --------------------------------------------------
  // OpenMessageForJobProvider
  // ---------------------------------------
  openMessageTO(id: number): void {
    if (this.Token().sub == 'JobProvider') {
      this._userService.GetJobSeekerById(id).subscribe({
        next: (data) => {
          console.log(data);
          this._chatService.jobSeekerId = data.id;
        },
      });
      localStorage.setItem('JobSeekerId', JSON.stringify(id));
      this._userService
        .GetJobProviderByIdOrByUserName('', this.Token().name)
        .pipe(
          takeUntilDestroyed(this.destroy),
          switchMap((data) => {
            this._authService.updateJobProviderId(data.id);
            return this._authService.CurrentJobProvider;
          }),
        )
        .subscribe({
          next: (data) => {
            localStorage.setItem('JobProviderId', JSON.stringify(data));
          },
        });
    }
    this._router.navigate(['/chat']);
  }
  // ----------------------------------------------------------------------
}
