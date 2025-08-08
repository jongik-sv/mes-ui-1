// progress
dhtmlXCellObject.prototype.progressOn = function() {

    if (this.conf.progress == true) return;

    this.conf.progress = true;

    // cover
    var t1 = document.createElement("DIV");
    t1.className = this.conf.idx_data.pr1;

    // image/animation
    var t2 = document.createElement("DIV");
    if (this.conf.skin == "material" && (window.dhx4.isFF || window.dhx4.isChrome || window.dhx4.isOpera || window.dhx4.isEdge)) {
        t2.className = this.conf.idx_data.pr3;
//      t2.innerHTML = '<svg class="dhx_cell_prsvg" viewBox="25 25 50 50"><circle class="dhx_cell_prcircle" cx="50" cy="50" r="20"/></svg>';
        t2.innerHTML = '<svg class="lds-spinner" width="200px" height="200px" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 100 100" preserveAspectRatio="xMidYMid" style="background: none;"><g transform="rotate(0 50 50)"><rect x="47.5" y="24" rx="4.75" ry="2.4" width="5" height="12" fill="#28292f"><animate attributeName="opacity" values="1;0" keyTimes="0;1" dur="1s" begin="-0.9166666666666666s" repeatCount="indefinite"></animate></rect></g><g transform="rotate(30 50 50)"><rect x="47.5" y="24" rx="4.75" ry="2.4" width="5" height="12" fill="#28292f"><animate attributeName="opacity" values="1;0" keyTimes="0;1" dur="1s" begin="-0.8333333333333334s" repeatCount="indefinite"></animate></rect></g><g transform="rotate(60 50 50)"><rect x="47.5" y="24" rx="4.75" ry="2.4" width="5" height="12" fill="#28292f"><animate attributeName="opacity" values="1;0" keyTimes="0;1" dur="1s" begin="-0.75s" repeatCount="indefinite"></animate></rect></g><g transform="rotate(90 50 50)"><rect x="47.5" y="24" rx="4.75" ry="2.4" width="5" height="12" fill="#28292f"><animate attributeName="opacity" values="1;0" keyTimes="0;1" dur="1s" begin="-0.6666666666666666s" repeatCount="indefinite"></animate></rect></g><g transform="rotate(120 50 50)"><rect x="47.5" y="24" rx="4.75" ry="2.4" width="5" height="12" fill="#28292f"><animate attributeName="opacity" values="1;0" keyTimes="0;1" dur="1s" begin="-0.5833333333333334s" repeatCount="indefinite"></animate></rect></g><g transform="rotate(150 50 50)"><rect x="47.5" y="24" rx="4.75" ry="2.4" width="5" height="12" fill="#28292f"><animate attributeName="opacity" values="1;0" keyTimes="0;1" dur="1s" begin="-0.5s" repeatCount="indefinite"></animate></rect></g><g transform="rotate(180 50 50)"><rect x="47.5" y="24" rx="4.75" ry="2.4" width="5" height="12" fill="#28292f"><animate attributeName="opacity" values="1;0" keyTimes="0;1" dur="1s" begin="-0.4166666666666667s" repeatCount="indefinite"></animate></rect></g><g transform="rotate(210 50 50)"><rect x="47.5" y="24" rx="4.75" ry="2.4" width="5" height="12" fill="#28292f"><animate attributeName="opacity" values="1;0" keyTimes="0;1" dur="1s" begin="-0.3333333333333333s" repeatCount="indefinite"></animate></rect></g><g transform="rotate(240 50 50)"><rect x="47.5" y="24" rx="4.75" ry="2.4" width="5" height="12" fill="#28292f"><animate attributeName="opacity" values="1;0" keyTimes="0;1" dur="1s" begin="-0.25s" repeatCount="indefinite"></animate></rect></g><g transform="rotate(270 50 50)"><rect x="47.5" y="24" rx="4.75" ry="2.4" width="5" height="12" fill="#28292f"><animate attributeName="opacity" values="1;0" keyTimes="0;1" dur="1s" begin="-0.16666666666666666s" repeatCount="indefinite"></animate></rect></g><g transform="rotate(300 50 50)"><rect x="47.5" y="24" rx="4.75" ry="2.4" width="5" height="12" fill="#28292f"><animate attributeName="opacity" values="1;0" keyTimes="0;1" dur="1s" begin="-0.08333333333333333s" repeatCount="indefinite"></animate></rect></g><g transform="rotate(330 50 50)"><rect x="47.5" y="24" rx="4.75" ry="2.4" width="5" height="12" fill="#28292f"><animate attributeName="opacity" values="1;0" keyTimes="0;1" dur="1s" begin="0s" repeatCount="indefinite"></animate></rect></g></svg>';
    } else {
        t2.className = this.conf.idx_data.pr2;
    }

    if (this.conf.idx.cover != null) {
        this.cell.insertBefore(t2, this.cell.childNodes[this.conf.idx.cover]);
    } else {
        this.cell.appendChild(t2);
    }
    this.cell.insertBefore(t1, t2);

    t1 = t2 = null;

    this._updateIdx();
    this._adjustProgress();

};