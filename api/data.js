export const config = {
  runtime: 'edge',
};

export default async function handler(req) {
  const { searchParams } = new URL(req.url);
  const kv = await process.env.KV;

  // 获取订单数据
  if (req.method === 'GET' && searchParams.get('type') === 'order') {
    const list = await kv.get('tracking_order', 'json') || [];
    return new Response(JSON.stringify(list), {
      headers: { 'Content-Type': 'application/json' }
    });
  }

  // 保存订单数据
  if (req.method === 'POST' && searchParams.get('type') === 'order') {
    const list = await req.json();
    await kv.set('tracking_order', JSON.stringify(list));
    return new Response('ok');
  }

  // 保存查询日志
  if (req.method === 'POST' && searchParams.get('type') === 'log') {
    const logItem = await req.json();
    let logs = await kv.get('tracking_log', 'json') || [];
    logs.unshift(logItem);
    if (logs.length > 100) logs = logs.slice(0, 100);
    await kv.set('tracking_log', JSON.stringify(logs));
    return new Response('ok');
  }

  // 获取查询日志
  if (req.method === 'GET' && searchParams.get('type') === 'log') {
    const logs = await kv.get('tracking_log', 'json') || [];
    return new Response(JSON.stringify(logs), {
      headers: { 'Content-Type': 'application/json' }
    });
  }

  // 清空日志
  if (req.method === 'POST' && searchParams.get('type') === 'clearlog') {
    await kv.set('tracking_log', JSON.stringify([]));
    return new Response('ok');
  }

  return new Response('Method Not Allowed', { status: 405 });
}
      headers: { 'Content-Type': 'application/json' }
    });
  }

  // 清空日志
  if (req.method === 'POST' && new URL(req.url).searchParams.get('type') === 'clearlog') {
    await kv.set('tracking_log', JSON.stringify([]));
    return new Response('ok');
  }

  return new Response('Method Not Allowed', { status: 405 });
}
