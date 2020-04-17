import { Component, OnInit } from "@angular/core";

export interface Tile {
  color: string;
  cols: number;
  rows: number;
  text: string;
  path: string;
}

@Component({
  selector: "app-sponsor-dash",
  templateUrl: "./sponsor.component.html",
  styleUrls: ["./sponsor.component.css"]
})
export class SponsorComponent implements OnInit {
  constructor() {}

  ngOnInit() {}

  tiles: Tile[] = [
    { text: "Point Status", cols: 3, rows: 1, color: "lightblue", path: "" },
    { text: "Manage Catalogs", cols: 1, rows: 2, color: "lightgreen", path: '/catalog-create' },
    { text: "View Purchase Status", cols: 1, rows: 1, color: "lightpink", path: "" },
    { text: "Cancel/Update Purchase", cols: 1, rows: 1, color: "#DDBDF1", path: "" },
    { text: "View Drivers", cols: 1, rows: 1, color: "#7f45d6", path: "" }
  ];
}
