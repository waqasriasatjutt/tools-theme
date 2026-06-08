(function () {
  function fmt(n, dp) {
    if (!isFinite(n)) return "—";
    return n.toLocaleString(undefined, { style: "currency", currency: "USD", maximumFractionDigits: dp == null ? 2 : dp });
  }

  function init(root) {
    if (!root || root.__mtgReady) return;
    root.__mtgReady = true;

    var pEl = root.querySelector(".mtg-principal");
    var rEl = root.querySelector(".mtg-rate");
    var yEl = root.querySelector(".mtg-years");
    var xEl = root.querySelector(".mtg-extra");
    var calcBtn = root.querySelector(".mtg-calc");
    var resetBtn = root.querySelector(".mtg-reset");
    var mEl = root.querySelector(".mtg-monthly");
    var iEl = root.querySelector(".mtg-interest");
    var tEl = root.querySelector(".mtg-total");
    var extraCard = root.querySelector(".mtg-card-extra");
    var savedEl = root.querySelector(".mtg-saved");
    var paidoffEl = root.querySelector(".mtg-paidoff");
    var schedule = root.querySelector(".mtg-schedule");
    var viewYearly = root.querySelector(".mtg-view-yearly");
    var viewMonthly = root.querySelector(".mtg-view-monthly");

    function build(P, r, n, extra) {
      var mr = r / 100 / 12;
      var base = mr === 0 ? P / n : P * mr * Math.pow(1 + mr, n) / (Math.pow(1 + mr, n) - 1);
      var schedule = [];
      var bal = P, month = 0;
      var maxMonths = n + 12 * 50;
      while (bal > 0.005 && month < maxMonths) {
        month++;
        var interest = bal * mr;
        var principal = base + extra - interest;
        if (principal > bal) principal = bal;
        bal -= principal;
        schedule.push({ month: month, principal: principal, interest: interest, balance: Math.max(0, bal) });
      }
      var totalInterest = schedule.reduce(function (s, m) { return s + m.interest; }, 0);
      return { monthly: base, schedule: schedule, totalInterest: totalInterest, months: schedule.length };
    }

    function renderSchedule(scheduleArr, monthly, extra) {
      if (!schedule) return;
      var yearly = viewYearly && viewYearly.checked;
      var rows;
      if (yearly) {
        var yrs = {};
        scheduleArr.forEach(function (m) {
          var y = Math.ceil(m.month / 12);
          if (!yrs[y]) yrs[y] = { year: y, principal: 0, interest: 0, balance: 0 };
          yrs[y].principal += m.principal;
          yrs[y].interest += m.interest;
          yrs[y].balance = m.balance;
        });
        rows = Object.values(yrs).map(function (y) {
          return '<tr><td>Year ' + y.year + '</td><td>' + fmt(y.principal) + '</td><td>' + fmt(y.interest) + '</td><td>' + fmt(y.balance) + '</td></tr>';
        }).join("");
      } else {
        rows = scheduleArr.map(function (m) {
          return '<tr><td>Month ' + m.month + '</td><td>' + fmt(m.principal) + '</td><td>' + fmt(m.interest) + '</td><td>' + fmt(m.balance) + '</td></tr>';
        }).join("");
      }
      schedule.innerHTML =
        '<table class="mtg-table">' +
        '<thead><tr><th>Period</th><th>Principal</th><th>Interest</th><th>Balance</th></tr></thead>' +
        '<tbody>' + rows + '</tbody></table>';
    }

    var lastResult = null;
    function recompute() {
      var P = parseFloat(pEl.value) || 0;
      var r = parseFloat(rEl.value) || 0;
      var y = parseInt(yEl.value, 10) || 0;
      var x = parseFloat(xEl.value) || 0;
      if (!P || !y) { mEl.textContent = iEl.textContent = tEl.textContent = "—"; return; }
      var n = y * 12;
      var baseRes = build(P, r, n, 0);
      var withExtra = x > 0 ? build(P, r, n, x) : null;
      mEl.textContent = fmt(baseRes.monthly + x);
      iEl.textContent = fmt((withExtra || baseRes).totalInterest);
      tEl.textContent = fmt(P + (withExtra || baseRes).totalInterest);
      if (withExtra && extraCard) {
        var saved = baseRes.totalInterest - withExtra.totalInterest;
        var monthsOff = baseRes.months - withExtra.months;
        savedEl.textContent = fmt(saved);
        var yrsOff = Math.floor(monthsOff / 12);
        var moOff = monthsOff % 12;
        paidoffEl.textContent = "Paid off " + (yrsOff ? yrsOff + " year(s) " : "") + (moOff ? moOff + " month(s) " : "") + "early";
        extraCard.hidden = saved <= 0;
      } else if (extraCard) extraCard.hidden = true;
      lastResult = (withExtra || baseRes);
      renderSchedule(lastResult.schedule, baseRes.monthly + x, x);
    }

    if (calcBtn) calcBtn.addEventListener("click", recompute);
    if (resetBtn) resetBtn.addEventListener("click", function () {
      pEl.value = 300000; rEl.value = 6.5; yEl.value = 30; xEl.value = 0;
      recompute();
    });
    [pEl, rEl, yEl, xEl].forEach(function (el) {
      if (el) el.addEventListener("input", recompute);
    });
    [viewYearly, viewMonthly].forEach(function (el) {
      if (el) el.addEventListener("change", function () {
        if (lastResult) renderSchedule(lastResult.schedule);
      });
    });

    recompute();
  }

  function boot() { document.querySelectorAll(".mortgage-tool").forEach(init); }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", boot, { once: true }); else boot();
  setTimeout(boot, 200); setTimeout(boot, 1200);
})();
