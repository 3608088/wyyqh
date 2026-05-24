import { kv } from '@vercel/kv';

export default async function handler(req) {
  // 获取订单数据
  if (req.method === 'GET' && req.query.type === 'order') {
    const list = await kv.get('tracking_order') || [];
    return new Response(JSON.stringify(list), {
      headers: { 'Content-Type': 'application/json' }
    });
  }

  // 保存订单数据
  if (req.method === 'POST' && req.query.type === 'order') {
    const list = await req.json();
    await kv.set('tracking_order', list);
    return new Response('ok');
  }

  // 保存查询日志
  if (req.method === 'POST' && req.query.type === 'log') {
    const logItem = await req.json();
    let logs = await kv.get('tracking_log') || [];
    logs.unshift(logItem);
    if (logs.length > 100) logs = logs.slice(0, 100);
    await kv.set('tracking_log', logs);
    return new Response('ok');
  }

  // 获取查询日志
  if (req.method === 'GET' && req.query.type === 'log') {
    const logs = await kv.get('tracking_log') || [];
    return new Response(JSON.stringify(logs), {
      headers: { 'Content-Type': 'application/json' }
    });
  }

  // 清空日志
  if (req.method === 'POST' && req.query.type === 'clearlog') {
    await kv.set('tracking_log', []);
    return new Response('ok');
  }

  return new Response('Method Not Allowed', { status: 405 });
}
