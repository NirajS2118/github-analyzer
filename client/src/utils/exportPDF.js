import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

export async function exportToPDF(data) {
  const { user1, user2 } = data;
  const doc = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });

  const BLUE = [88, 166, 255];
  const GREEN = [63, 185, 80];
  const DARK = [13, 17, 23];
  const GRAY = [139, 148, 158];
  const WHITE = [255, 255, 255];
  const SURFACE = [22, 27, 34];

  doc.setFillColor(...DARK);
  doc.rect(0, 0, 210, 297, "F");

  doc.setFillColor(...SURFACE);
  doc.rect(0, 0, 210, 22, "F");
  doc.setTextColor(...WHITE);
  doc.setFontSize(13);
  doc.setFont("helvetica", "bold");
  doc.text("GitHub Competitive Analyzer", 14, 14);
  doc.setFontSize(9);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(...GRAY);
  doc.text(`Generated ${new Date().toLocaleDateString()}`, 196, 14, { align: "right" });

  function drawProfileHeader(user, x, color) {
    doc.setFillColor(...SURFACE);
    doc.roundedRect(x, 28, 88, 28, 3, 3, "F");
    doc.setTextColor(...color);
    doc.setFontSize(11);
    doc.setFont("helvetica", "bold");
    doc.text(`@${user.profile.login}`, x + 5, 37);
    doc.setTextColor(...WHITE);
    doc.setFontSize(9);
    doc.setFont("helvetica", "normal");
    doc.text(user.profile.name || user.profile.login, x + 5, 44);
    doc.setTextColor(...GRAY);
    doc.setFontSize(8);
    if (user.profile.location) doc.text(`📍 ${user.profile.location}`, x + 5, 50);
  }

  drawProfileHeader(user1, 11, BLUE);
  doc.setTextColor(...GRAY);
  doc.setFontSize(10);
  doc.setFont("helvetica", "bold");
  doc.text("vs", 105, 44, { align: "center" });
  drawProfileHeader(user2, 111, GREEN);

  const s1 = user1.score;
  const s2 = user2.score;
  const total = s1 + s2 || 1;
  const pct1 = Math.round((s1 / total) * 100);
  const winner = s1 > s2 ? user1.profile.login : s2 > s1 ? user2.profile.login : "Tie";

  doc.setFillColor(...SURFACE);
  doc.roundedRect(11, 60, 188, 18, 3, 3, "F");
  doc.setTextColor(...BLUE);
  doc.setFontSize(8);
  doc.setFont("helvetica", "bold");
  doc.text(`${s1.toLocaleString()} pts`, 16, 67);
  doc.setTextColor(...WHITE);
  doc.text(`Overall score — ${winner} wins`, 105, 67, { align: "center" });
  doc.setTextColor(...GREEN);
  doc.text(`${s2.toLocaleString()} pts`, 194, 67, { align: "right" });

  const barX = 16, barY = 71, barW = 178, barH = 4;
  doc.setFillColor(48, 54, 61);
  doc.roundedRect(barX, barY, barW, barH, 2, 2, "F");
  doc.setFillColor(...BLUE);
  doc.roundedRect(barX, barY, (barW * pct1) / 100, barH, 2, 2, "F");

  autoTable(doc, {
    startY: 84,
    head: [[user1.profile.login, "Metric", user2.profile.login]],
    body: [
      [user1.stats.repos, "Public repos", user2.stats.repos],
      [user1.stats.followers.toLocaleString(), "Followers", user2.stats.followers.toLocaleString()],
      [user1.stats.following, "Following", user2.stats.following],
      [user1.stats.totalStars.toLocaleString(), "Total stars ⭐", user2.stats.totalStars.toLocaleString()],
      [user1.stats.totalForks, "Total forks", user2.stats.totalForks],
      [user1.stats.gists, "Public gists", user2.stats.gists],
      [`${user1.profile.accountAge}y`, "Account age", `${user2.profile.accountAge}y`],
    ],
    styles: {
      fillColor: SURFACE,
      textColor: WHITE,
      fontSize: 9,
      cellPadding: 4,
    },
    headStyles: {
      fillColor: [30, 37, 46],
      textColor: WHITE,
      fontStyle: "bold",
      halign: "center",
    },
    columnStyles: {
      0: { halign: "right", textColor: BLUE },
      1: { halign: "center", textColor: GRAY },
      2: { halign: "left", textColor: GREEN },
    },
    alternateRowStyles: { fillColor: [18, 23, 30] },
    tableLineColor: [48, 54, 61],
    tableLineWidth: 0.2,
    margin: { left: 11, right: 11 },
  });

  const afterTable = doc.lastAutoTable.finalY + 8;

  function drawLangs(user, x, color, label) {
    doc.setFillColor(...SURFACE);
    doc.roundedRect(x, afterTable, 88, 60, 3, 3, "F");
    doc.setTextColor(...color);
    doc.setFontSize(8);
    doc.setFont("helvetica", "bold");
    doc.text(`${label} — Languages`, x + 5, afterTable + 8);
    user.languages.slice(0, 5).forEach((l, i) => {
      const y = afterTable + 16 + i * 10;
      doc.setTextColor(...GRAY);
      doc.setFont("helvetica", "normal");
      doc.text(l.lang, x + 5, y);
      doc.text(`${l.pct}%`, x + 83, y, { align: "right" });
      doc.setFillColor(48, 54, 61);
      doc.roundedRect(x + 5, y + 2, 78, 2.5, 1, 1, "F");
      doc.setFillColor(...color);
      doc.roundedRect(x + 5, y + 2, (78 * l.pct) / 100, 2.5, 1, 1, "F");
    });
  }

  drawLangs(user1, 11, BLUE, user1.profile.login);
  drawLangs(user2, 111, GREEN, user2.profile.login);

  const repoY = afterTable + 74;

  function drawRepos(user, x, color) {
    doc.setFillColor(...SURFACE);
    doc.roundedRect(x, repoY, 88, 72, 3, 3, "F");
    doc.setTextColor(...color);
    doc.setFontSize(8);
    doc.setFont("helvetica", "bold");
    doc.text(`${user.profile.login} — Top repos`, x + 5, repoY + 8);
    user.topRepos.slice(0, 4).forEach((r, i) => {
      const y = repoY + 16 + i * 14;
      doc.setTextColor(...WHITE);
      doc.setFont("helvetica", "bold");
      doc.setFontSize(8);
      doc.text(r.name.substring(0, 20), x + 5, y);
      doc.setTextColor(...GRAY);
      doc.setFont("helvetica", "normal");
      doc.setFontSize(7);
      const desc = (r.description || "No description").substring(0, 30);
      doc.text(desc, x + 5, y + 4);
      doc.setTextColor(...color);
      doc.text(`⭐ ${r.stars}  🍴 ${r.forks}`, x + 5, y + 8);
    });
  }

  drawRepos(user1, 11, BLUE);
  drawRepos(user2, 111, GREEN);

  doc.setFillColor(...SURFACE);
  doc.rect(0, 285, 210, 12, "F");
  doc.setTextColor(...GRAY);
  doc.setFontSize(7);
  doc.setFont("helvetica", "normal");
  doc.text("github-analyzer.vercel.app", 105, 292, { align: "center" });

  doc.save(`github-comparison-${user1.profile.login}-vs-${user2.profile.login}.pdf`);
}
