# Testing Guide - Payment System

## Automated Tests

### Unit Tests

Create `__tests__/payments/calculations.test.ts`:

```typescript
import { describe, it, expect } from '@jest/globals';
import {
  calculatePaymentBreakdown,
  distributeRewards,
  canWithdraw,
  MIN_WITHDRAWAL_AMOUNT,
} from '@/lib/payments/calculations';

describe('Payment Calculations', () => {
  it('calculates correct payment breakdown', () => {
    const breakdown = calculatePaymentBreakdown(1000000); // 10,000 ARS
    
    expect(breakdown.slicePrice).toBe(1000000);
    expect(breakdown.platformFee).toBe(150000); // 15%
    expect(breakdown.communityRewardPool).toBe(30000); // 3%
    expect(breakdown.totalAmount).toBe(1150000);
  });

  it('distributes rewards proportionally', () => {
    const rewards = distributeRewards(30000, [
      { commentId: '1', userId: 'user1', hearts: 10 },
      { commentId: '2', userId: 'user2', hearts: 5 },
      { commentId: '3', userId: 'user3', hearts: 5 },
    ]);

    expect(rewards[0].amount).toBe(15000); // 50%
    expect(rewards[1].amount).toBe(7500);  // 25%
    expect(rewards[2].amount).toBe(7500);  // 25%
  });

  it('validates withdrawal eligibility', () => {
    expect(canWithdraw(MIN_WITHDRAWAL_AMOUNT)).toBe(true);
    expect(canWithdraw(MIN_WITHDRAWAL_AMOUNT - 1)).toBe(false);
    expect(canWithdraw(0)).toBe(false);
  });
});
```

### Integration Tests

Create `__tests__/api/payments.test.ts`:

```typescript
import { describe, it, expect } from '@jest/globals';

describe('Payment API', () => {
  it('creates escrow on slice acceptance', async () => {
    const response = await fetch('/api/slices/test-id/accept', {
      method: 'POST',
      body: JSON.stringify({
        bidAmount: 1000000,
        providerId: 'provider-id',
      }),
    });

    const data = await response.json();
    expect(response.ok).toBe(true);
    expect(data.escrowPaymentId).toBeDefined();
    expect(data.breakdown.totalAmount).toBe(1150000);
  });

  it('releases payment on approval', async () => {
    const response = await fetch('/api/slices/test-id/approve', {
      method: 'POST',
    });

    const data = await response.json();
    expect(response.ok).toBe(true);
    expect(data.success).toBe(true);
  });
});
```

### Run Tests

```bash
npm test
```

---

## Manual Testing Scenarios

### Scenario 1: Happy Path (Stripe)

**Steps**:
1. Client accepts slice bid of 10,000 ARS
2. Navigate to `/checkout/:sliceId`
3. Click "Pay with Stripe"
4. Enter card: `4242 4242 4242 4242`
5. Complete payment
6. Provider marks slice complete
7. Client approves work
8. Verify payment released

**Expected Results**:
- ✅ Escrow created with 11,500 ARS total
- ✅ Stripe Payment Intent in manual capture mode
- ✅ Provider receives 10,000 ARS
- ✅ Community receives 300 ARS (3%)
- ✅ Platform receives ~1,200 ARS (12%)
- ✅ All emails sent

**Database Checks**:
```sql
SELECT * FROM escrow_payments WHERE slice_id = 'test-slice-id';
-- status should be 'released'

SELECT * FROM community_rewards WHERE slice_id = 'test-slice-id';
-- should have records for helpful comments

SELECT * FROM user_wallets WHERE user_id IN (SELECT user_id FROM community_rewards);
-- balances should be updated
```

---

### Scenario 2: Happy Path (Mercado Pago)

**Steps**:
1. Client accepts slice bid of 10,000 ARS
2. Navigate to `/checkout/:sliceId`
3. Click "Pay with Mercado Pago"
4. Complete MP checkout
5. Return to success page
6. Provider marks complete
7. Client approves

**Expected Results**:
- ✅ Redirected to Mercado Pago
- ✅ Payment processed
- ✅ Returned to success page
- ✅ Escrow status updated
- ✅ Payment released on approval

---

### Scenario 3: Payment Failure

**Steps**:
1. Use declined card: `4000 0000 0000 0002`
2. Attempt payment
3. Verify failure handling

**Expected Results**:
- ✅ Redirected to failure page
- ✅ Escrow status = 'failed'
- ✅ Client receives failure email
- ✅ Can retry payment

---

### Scenario 4: Community Rewards

**Steps**:
1. User A posts helpful comment
2. User B hearts the comment
3. Client marks comment as helpful
4. Client approves slice
5. Check User A's wallet

**Expected Results**:
- ✅ Comment hearts count incremented
- ✅ Comment marked as helpful
- ✅ Reward calculated based on hearts
- ✅ Wallet balance updated
- ✅ User A receives email

---

### Scenario 5: Wallet Withdrawal

**Steps**:
1. User has 1,000 ARS in wallet
2. Navigate to `/wallet`
3. Click "Withdraw"
4. Enter 500 ARS and MP email
5. Submit withdrawal

**Expected Results**:
- ✅ Withdrawal validation passes
- ✅ Wallet balance reduced to 500 ARS
- ✅ Total withdrawn updated
- ✅ Confirmation shown

---

## Edge Cases to Test

### 1. Concurrent Approvals
**Test**: Two clients try to approve same slice simultaneously
**Expected**: Only one succeeds, other gets error

### 2. Insufficient Balance
**Test**: Withdraw more than wallet balance
**Expected**: Error message shown

### 3. Minimum Withdrawal
**Test**: Try to withdraw 100 ARS (below minimum)
**Expected**: Validation error

### 4. Webhook Retry
**Test**: Webhook fails first time
**Expected**: Stripe/MP retries, eventually succeeds

### 5. Network Timeout
**Test**: Slow network during payment
**Expected**: Graceful timeout, retry option

---

## Performance Testing

### Load Test Script

```bash
# Install k6
brew install k6

# Run load test
k6 run loadtest.js
```

**loadtest.js**:
```javascript
import http from 'k6/http';
import { check, sleep } from 'k6';

export let options = {
  vus: 50, // 50 virtual users
  duration: '30s',
};

export default function () {
  let res = http.get('https://umarel.com/pricing');
  check(res, {
    'status is 200': (r) => r.status === 200,
    'response time < 2s': (r) => r.timings.duration < 2000,
  });
  sleep(1);
}
```

**Expected Results**:
- Response time: < 2s
- Error rate: < 1%
- Throughput: > 100 req/s

---

## Security Testing

### 1. SQL Injection
**Test**: Try malicious input in payment amount
**Expected**: Drizzle ORM prevents injection

### 2. XSS
**Test**: Try script tags in comment content
**Expected**: Content sanitized

### 3. CSRF
**Test**: Submit payment from external site
**Expected**: Request rejected

### 4. Rate Limiting
**Test**: Make 100 requests in 1 second
**Expected**: Rate limit triggered

---

## Accessibility Testing

### WCAG Compliance
- [ ] Keyboard navigation works
- [ ] Screen reader compatible
- [ ] Color contrast meets AA standard
- [ ] Form labels present
- [ ] Error messages clear

---

## Browser Testing

### Desktop
- [ ] Chrome (latest)
- [ ] Firefox (latest)
- [ ] Safari (latest)
- [ ] Edge (latest)

### Mobile
- [ ] iOS Safari
- [ ] Android Chrome
- [ ] Mobile responsive design

---

## Test Data

### Test Cards (Stripe)
```
Success: 4242 4242 4242 4242
Decline: 4000 0000 0000 0002
Requires Auth: 4000 0025 0000 3155
Insufficient Funds: 4000 0000 0000 9995
```

### Test Users
```
Client: client@test.com
Provider: provider@test.com
Helper: helper@test.com
```

---

## Regression Testing

After each deployment, verify:
- [ ] Existing payments still work
- [ ] Wallet balances accurate
- [ ] Emails still sending
- [ ] Webhooks processing
- [ ] No broken links

---

## Test Coverage Goals

- Unit tests: > 80%
- Integration tests: > 60%
- E2E tests: Critical paths covered
- Manual testing: All scenarios passed

---

**Status**: Test Suite Ready ✅  
**Last Run**: Run before each deployment  
**Maintainer**: Development Team
