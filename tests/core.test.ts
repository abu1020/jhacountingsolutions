import { test } from 'node:test';
import assert from 'node:assert/strict';
import handler from '../api/contact.js';
import { contactFormSchema, consultationModalSchema, approvedServicesEnum } from '../src/lib/validations.ts';

const validContact = { name: 'Rishi Jha', company: '', phone: '9876543210', email: 'rishi@example.com', serviceNeeded: 'GST Compliance Services', message: 'Please get in touch.' };
test('contact validation accepts a valid enquiry and rejects malformed input', () => {
  assert.equal(contactFormSchema.safeParse(validContact).success, true);
  assert.equal(contactFormSchema.safeParse({ ...validContact, email: 'invalid' }).success, false);
  assert.equal(contactFormSchema.safeParse({ ...validContact, serviceNeeded: 'Invented Service' }).success, false);
  assert.equal(contactFormSchema.safeParse({ ...validContact, message: 'x'.repeat(1001) }).success, false);
});
test('consultation uses the same approved services', () => {
  assert.equal(consultationModalSchema.safeParse({ fullName: validContact.name, workEmail: validContact.email, phone: validContact.phone, businessType: 'Individual', serviceNeeded: validContact.serviceNeeded, message: '' }).success, true);
  assert.equal(approvedServicesEnum.safeParse('Direct Consultation Request').success, false);
});
function response() {
  const result: { headers: Record<string, string>, statusCode?: number, body?: any, setHeader: Function, status: Function, json: Function } = { headers: {}, setHeader(key: string, value: string) { result.headers[key] = value; }, status(code: number) { result.statusCode = code; return result; }, json(body: any) { result.body = body; return result; } };
  return result;
}
test('legacy endpoint never claims to persist a submission', () => {
  const res = response(); handler({ method: 'POST', body: validContact }, res);
  assert.equal(res.statusCode, 503); assert.equal(res.body.success, false); assert.equal(res.headers['Cache-Control'], 'no-store');
});
test('legacy endpoint rejects non-POST requests', () => {
  const res = response(); handler({ method: 'GET' }, res);
  assert.equal(res.statusCode, 405); assert.equal(res.headers.Allow, 'POST');
});
