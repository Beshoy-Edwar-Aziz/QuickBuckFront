import {
  AfterViewInit,
  Component,
  DestroyRef,
  ElementRef,
  inject,
  OnDestroy,
  OnInit,
  signal,
  ViewChild,
  WritableSignal,
} from '@angular/core';
import { ChatService } from '../../Services/chat.service';
import { UsersService } from '../../Services/users.service';
import { AuthServiceService } from '../../Services/auth-service.service';
import { CommonModule, DatePipe } from '@angular/common';
import { jwtDecode } from 'jwt-decode';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { switchMap } from 'rxjs';
import { MessagesInterface } from '../../../models/messages-interface';

@Component({
  selector: 'app-chat-room',
  standalone: true,
  imports: [CommonModule, DatePipe],
  templateUrl: './chat-room.component.html',
  styleUrl: './chat-room.component.css',
})
export class ChatRoomComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('msgInput') msgInput!: ElementRef;
  private chatService = inject(ChatService);
  private _userService = inject(UsersService);
  private _authService = inject(AuthServiceService);
  private destroy = inject(DestroyRef);
  ngAfterViewInit(): void {
    let x: any = localStorage.getItem('JobSeekerId');

    console.log(JSON.parse(x));
  }
  RecievedMsg: any = '';
  json: any = localStorage.getItem('JobProviderId');
  json2: any = localStorage.getItem('JobSeekerId');
  jobProviderId: number = JSON.parse(this.json);
  jobSeekerId: number = JSON.parse(this.json2);
  CurrentToken: any = localStorage.getItem('Token');
  Token: any = jwtDecode(this.CurrentToken);
  TokenRole: string = this.Token.sub;
  Messages: WritableSignal<MessagesInterface[]> = signal<MessagesInterface[]>(
    [],
  );
  JobProviderInfo: WritableSignal<any> = signal<any>({});
  TalkedToPreviously: any;
  user: any;

  ngOnInit(): void {
    this._authService.CurrentJobSeeker.subscribe((data) => {
      if (data != '') {
        console.log('behavior', data);

        this.jobSeekerId = data;
      }
    });
    this._authService.CurrentJobProvider.subscribe((data) => {
      if (data != '' && data != undefined) {
        this.jobProviderId = data;
        console.log(data);
      }
    });
    console.log(this.Token);
    console.log(this.TokenRole);
    console.log(this.jobSeekerId);
    console.log('jobproviderid', this.jobProviderId);

    this.chatService
      .getMessages(this.jobProviderId, this.jobSeekerId)
      .pipe(takeUntilDestroyed(this.destroy))
      .subscribe({
        next: (data) => {
          console.log(data);
          console.log(this.jobProviderId);

          this.Messages.set(data.reverse());
        },
        error: (err) => {
          console.log(err);
        },
      });
    this.chatService
      .startConnection()
      .pipe(
        takeUntilDestroyed(this.destroy),
        switchMap(() =>
          this.chatService.joinConversation(
            this.jobSeekerId,
            this.jobProviderId,
          ),
        ),
      )
      .subscribe({
        next: () => {
          console.log('working');

          this.chatService
            .recieveMessage()
            .pipe(takeUntilDestroyed(this.destroy))
            .subscribe({
              next: (message: any) => {
                const newMessage = {
                  id: Date.now(),
                  jobSeekerId: this.jobSeekerId,
                  jobProviderId: this.jobProviderId,
                  jobSeeker: null,
                  jobProvider: null,
                  content: message.Message,
                  userName: message.name,
                  dateTime: new Date().toISOString(),
                } as MessagesInterface;
                this.Messages.set([...this.Messages(), newMessage]);
                this.msgInput.nativeElement.value = '';
              },
              error: (err) => {
                console.log(err);
              },
            });
        },
        error: (err) => {
          console.log(err);
        },
      });

    if (this.TokenRole == 'JobSeeker') {
      this._userService
        .GetJobSeekerByUserName(this.Token.name)
        .pipe(takeUntilDestroyed(this.destroy))
        .subscribe({
          next: (data) => {
            console.log(data);

            this._userService
              .GetJobSeekerById(this.jobSeekerId)
              .pipe(takeUntilDestroyed(this.destroy))
              .subscribe({
                next: (dataa) => {
                  this.jobSeekerId = dataa.id;
                  console.log(this.chatService.jobSeekerId);
                },
              });
          },
        });
      this._userService
        .GetJobProviderByIdOrByUserName(this.jobProviderId, '')
        .pipe(takeUntilDestroyed(this.destroy))
        .subscribe({
          next: (data) => {
            this.JobProviderInfo.set(data);
            console.log(data);
          },
        });
      this.chatService
        .getMessagesByJobSeekerId(this.jobSeekerId, '')
        .pipe(takeUntilDestroyed(this.destroy))
        .subscribe({
          next: (data) => {
            console.log(data);
            this.TalkedToPreviously = data;
          },
          error: (err) => {
            console.log(err);
          },
        });
    } else if (this.TokenRole == 'JobProvider') {
      this._userService
        .GetJobProviderByIdOrByUserName('', this._authService.Token.name)
        .pipe(takeUntilDestroyed(this.destroy))
        .subscribe({
          next: (data) => {
            console.log(data);
            this.jobProviderId = data.id;
          },
        });
      const x = localStorage.getItem('JobSeekerId');
      this.jobSeekerId = JSON.parse(x!);
      this._userService.GetJobSeekerById(this.jobSeekerId).subscribe({
        next: (data) => {
          this.JobSeekerInfo = data;
        },
      });
      this.chatService
        .getMessagesByJobSeekerId(0, this.jobProviderId)
        .subscribe({
          next: (data) => {
            console.log(data);
            this.TalkedToPreviously = data;
          },
          error: (err) => {
            console.log(err);
          },
        });
    }
  }
  ngOnDestroy(): void {
    this.chatService
      .leaveConversation(this.jobSeekerId, this.jobProviderId)
      .subscribe();
  }
  JobSeekerInfo: any;
  sendMessage(jobSeekerId: number, jobProviderId: number): void {
    if (this.TokenRole == 'JobSeeker') {
      this._userService
        .GetJobProviderByIdOrByUserName(jobProviderId, '')
        .pipe(takeUntilDestroyed(this.destroy))
        .subscribe({
          next: (data) => {
            console.log(data);
            try {
              this.chatService.sendMessage(
                this.msgInput.nativeElement.value,
                jobProviderId,
                jobSeekerId,
                this.TokenRole,
                this.Token.name,
              );
            } catch (ex) {
              console.log(ex);
            }
          },
        });
    } else if (this.TokenRole == 'JobProvider') {
      this._userService
        .GetJobSeekerById(jobSeekerId)
        .pipe(takeUntilDestroyed(this.destroy))
        .subscribe({
          next: (data) => {
            console.log(data);
            this.chatService.sendMessage(
              this.msgInput.nativeElement.value,
              jobProviderId,
              jobSeekerId,
              this.TokenRole,
              this.Token.name,
            );
          },
        });
    }

    let element = document.getElementById('MessageWindow');
    element?.scrollTo(100, 400);
  }
  getMessageById(MessageId: number) {
    this.chatService.getMessageById(MessageId).subscribe({
      next: (data) => {
        console.log(data);
      },
      error: (err) => {
        console.log(err);
      },
    });
  }
  openNewChat(jobSeekerId: number, jobProviderId: number): void {
    if (this.TokenRole == 'JobSeeker') {
      this.removesMessages();
      this.chatService.getMessages(jobProviderId, this.jobSeekerId).subscribe({
        next: (data) => {
          console.log(data);
          data.reverse();
          this.Messages.set(data);
          this.jobProviderId = jobProviderId;
          this._userService
            .GetJobProviderByIdOrByUserName(jobProviderId, '')
            .subscribe({
              next: (data) => {
                this.JobProviderInfo.set(data);
              },
            });

          this.chatService
            .getMessages(this.jobProviderId, this.jobSeekerId)
            .subscribe({
              next: (data) => {
                console.log(data);
                data.reverse();
                this.Messages.set(data);
              },
            });
        },
      });
    } else {
      this.removesMessages();
      this.chatService.getMessages(this.jobProviderId, jobSeekerId).subscribe({
        next: (data) => {
          console.log(data);
          data.reverse();
          this.Messages.set(data);
          this.jobSeekerId = jobSeekerId;
          this._userService.GetJobSeekerById(jobSeekerId).subscribe({
            next: (data) => {
              this.JobSeekerInfo = data;
            },
          });

          this.chatService
            .getMessages(this.jobProviderId, this.jobSeekerId)
            .subscribe({
              next: (data) => {
                console.log(data);
                data.reverse();
                this.Messages.set(data);
              },
            });
        },
      });
    }
  }
  removesMessages(): void {
    let msg: any = document.querySelectorAll('#MessageWindow .Generated');
    let img: any = document.querySelectorAll('#MessageWindow img');
    msg.forEach((element: any) => {
      element.remove();
    });

    console.log(msg);
  }
}
