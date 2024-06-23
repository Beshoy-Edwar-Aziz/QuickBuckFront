import { Component, OnInit } from '@angular/core';
import AOS from 'aos'
@Component({
  selector: 'app-about-us',
  standalone: true,
  imports: [],
  templateUrl: './about-us.component.html',
  styleUrl: './about-us.component.css'
})
export class AboutUsComponent implements OnInit {
  constructor(){

  }
  ngOnInit(): void {
    AOS.init();
  }

}
