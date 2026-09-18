const weeklyHours = document.querySelector('#weekly-hours');
const peopleCount = document.querySelector('#people-count');
const hourlyCost = document.querySelector('#hourly-cost');
const reductionRate = document.querySelector('#reduction-rate');
const annualCost = document.querySelector('#annual-cost');
const annualSaving = document.querySelector('#annual-saving');
const contactForm = document.querySelector('#contact-form');
const formStatus = document.querySelector('#form-status');

const currency = new Intl.NumberFormat('zh-CN', {
  style: 'currency',
  currency: 'CNY',
  maximumFractionDigits: 0,
});

function numberFrom(input, fallback = 0) {
  const value = Number(input?.value);
  return Number.isFinite(value) ? Math.max(value, 0) : fallback;
}

function updateSavings() {
  const hours = numberFrom(weeklyHours);
  const people = Math.max(1, numberFrom(peopleCount, 1));
  const cost = numberFrom(hourlyCost);
  const reduction = Number(reductionRate?.value) || 0;
  const totalCost = hours * people * cost * 52;
  const saving = totalCost * reduction;

  annualCost.textContent = currency.format(totalCost);
  annualSaving.textContent = currency.format(saving);
}

[weeklyHours, peopleCount, hourlyCost, reductionRate].forEach((input) => {
  input?.addEventListener('input', updateSavings);
  input?.addEventListener('change', updateSavings);
});

contactForm?.addEventListener('submit', (event) => {
  event.preventDefault();

  const name = document.querySelector('#contact-name')?.value.trim() || '';
  const method = document.querySelector('#contact-method')?.value.trim() || '';
  const problem = document.querySelector('#contact-problem')?.value.trim() || '';
  const email = contactForm.dataset.contactEmail?.trim() || '';
  const githubUrl = contactForm.dataset.githubUrl?.trim() || '';

  if (!name || !method || !problem) {
    formStatus.textContent = '请先填写完整信息。';
    return;
  }

  if (email && email !== 'your@email.com') {
    const subject = encodeURIComponent(`流程诊断预约｜${name}`);
    const body = encodeURIComponent(
      `称呼：${name}\n联系方式：${method}\n\n最想解决的重复工作：\n${problem}\n\n我希望先了解：\n1. 是否值得自动化\n2. 预计节省的时间\n3. 合适的起步方案`
    );
    formStatus.textContent = '正在打开邮件应用……';
    window.location.href = `mailto:${email}?subject=${subject}&body=${body}`;
    return;
  }

  if (githubUrl) {
    formStatus.textContent = '演示站点尚未配置邮箱，正在打开 GitHub……';
    window.open(githubUrl, '_blank', 'noopener,noreferrer');
    return;
  }

  formStatus.textContent = '还没有配置联系方式，请先补充 data-github-url 或 data-contact-email。';
});

updateSavings();
