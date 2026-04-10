import { useState, useEffect, useRef } from 'react';
import { IconActivity, IconWarning, IconLayoutList, IconFileText, IconAutomation, IconMessage } from '@idpxyz/ui-icons';
import { orderTimelines, exceptions as allExceptions, type SidebarSelection } from '../data/oms';
import { SkeletonEventList } from '@idpxyz/ui-patterns';
import { Button, PanelShell, PanelTabBar, PanelTab, PanelContent } from '@idpxyz/ui-primitives';

interface BottomPanelProps {
  visible: boolean;
  height: number;
  maximized: boolean;
  onClose: () => void;
  onMaximize: () => void;
  selectedObject: SidebarSelection | null;
}

export default function BottomPanel({ visible, height, maximized, onClose, onMaximize, selectedObject }: BottomPanelProps) {
  const [activeTab, setActiveTab] = useState('events');
  const [isLoading, setIsLoading] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    setIsLoading(true);
    timerRef.current = setTimeout(() => setIsLoading(false), 400);
    return () => { if (timerRef.current) clearTimeout(timerRef.current); };
  }, [activeTab, selectedObject]);

  const tabs = [
    { id: 'events', label: '事件', icon: <IconAutomation size={14} /> },
    { id: 'logs', label: '日志', icon: <IconActivity size={14} /> },
    { id: 'exceptions', label: '异常', icon: <IconWarning size={14} />, badge: 7 },
    { id: 'jobs', label: '任务', icon: <IconLayoutList size={14} /> },
    { id: 'audit', label: '审计', icon: <IconFileText size={14} /> },
    { id: 'comments', label: '备注', icon: <IconMessage size={14} />, badge: 3 },
  ];

  const orderId = selectedObject?.kind === 'order'
    ? selectedObject.payload.id
    : selectedObject?.kind === 'exception'
      ? selectedObject.payload.orderId
      : undefined;
  const timeline = orderId ? (orderTimelines[orderId] || []) : [];
  const relatedExceptions = orderId ? allExceptions.filter(e => e.orderId === orderId) : allExceptions.slice(0, 5);

  return (
    <PanelShell height={height} visible={visible}>
      <PanelTabBar maximized={maximized} onMaximize={onMaximize} onClose={onClose}>
        {tabs.map((tab) => (
          <PanelTab
            key={tab.id}
            active={activeTab === tab.id}
            icon={tab.icon}
            label={tab.label}
            badge={tab.badge}
            onClick={() => setActiveTab(tab.id)}
          />
        ))}
      </PanelTabBar>

      <PanelContent>
        {isLoading ? (
          <SkeletonEventList />
        ) : activeTab === 'events' ? (
          <EventsContent timeline={timeline} orderId={orderId} />
        ) : activeTab === 'exceptions' ? (
          <ExceptionsContent exceptions={relatedExceptions} />
        ) : activeTab === 'logs' ? (
          <LogsContent />
        ) : activeTab === 'comments' ? (
          <CommentsContent />
        ) : (
          <div className="text-[12px] text-idpxyz-textMuted py-4 text-center">
            {selectedObject ? `已选择对象：${selectedObject.payload.id}` : '请选择一个对象以查看详情'}
          </div>
        )}
      </PanelContent>
    </PanelShell>
  );
}

function EventsContent({ timeline, orderId }: { timeline: any[]; orderId?: string }) {
  if (timeline.length === 0) {
    return (
      <div className="text-[12px] text-idpxyz-textMuted py-4 text-center">
        {orderId ? `订单 ${orderId} 暂无事件记录` : '请选择一个订单以查看事件时间线'}
      </div>
    );
  }
  const typeColor: Record<string, string> = { system: 'text-idpxyz-textMuted', human: 'text-idpxyz-accent', external: 'text-green-400', payment: 'text-yellow-400', shipment: 'text-blue-400' };
  return (
    <div className="space-y-0">
      <div className="text-[10px] uppercase tracking-wider text-idpxyz-textMuted font-semibold mb-2">
        {orderId ? `${orderId} 事件时间线` : '事件时间线'}
      </div>
      {timeline.map((evt, i) => (
        <div key={i} className="flex items-start gap-3 py-1.5 text-[12px]">
          <span className="text-idpxyz-textMuted font-mono w-[120px] shrink-0 text-[11px]">{evt.time}</span>
          <span className={`w-[80px] shrink-0 ${typeColor[evt.type] || 'text-idpxyz-textMuted'}`}>{evt.actor}</span>
          <span className="text-idpxyz-text flex-1">{evt.action}</span>
        </div>
      ))}
    </div>
  );
}

function ExceptionsContent({ exceptions }: { exceptions: any[] }) {
  if (exceptions.length === 0) {
    return <div className="text-[12px] text-idpxyz-textMuted py-4 text-center">暂无相关异常</div>;
  }
  return (
    <div className="space-y-0">
      <div className="text-[10px] uppercase tracking-wider text-idpxyz-textMuted font-semibold mb-2">相关异常</div>
      {exceptions.map((exc) => (
        <div key={exc.id} className="flex items-start gap-3 py-1.5 text-[12px]">
          <span className="text-idpxyz-accent font-medium w-[80px] shrink-0">{exc.id}</span>
          <span className="text-idpxyz-text w-[120px] shrink-0">{exc.orderId}</span>
          <span className="text-idpxyz-text flex-1 truncate">{exc.description}</span>
        </div>
      ))}
    </div>
  );
}

function LogsContent() {
  const logs = [
    { time: '14:30:12', level: 'INFO', msg: '[OrderService] 订单 ORD-20250301-001 地址变更请求已接收' },
    { time: '14:25:08', level: 'INFO', msg: '[AllocationEngine] 华东仓分配确认：3件商品' },
    { time: '14:10:33', level: 'WARN', msg: '[CarrierAPI] 承运商费率差异检测：ORD-20250301-008，差额 >15%' },
    { time: '12:15:22', level: 'WARN', msg: '[AddressValidator] 低置信度匹配：ORD-20250301-010' },
    { time: '11:05:44', level: 'ERROR', msg: '[PaymentGateway] 授权被拒：ORD-20250301-005，余额不足' },
    { time: '10:30:15', level: 'WARN', msg: '[RiskEngine] 高风险评分 87/100：ORD-20250301-002' },
    { time: '08:00:03', level: 'ERROR', msg: '[FulfillmentAPI] 503 服务不可用（第3次）：ORD-20250301-006' },
  ];
  const levelColor: Record<string, string> = { INFO: 'text-blue-400', WARN: 'text-yellow-400', ERROR: 'text-red-400' };
  return (
    <div className="font-mono text-[11px] space-y-0.5">
      {logs.map((log, i) => (
        <div key={i} className="flex gap-2">
          <span className="text-idpxyz-textMuted w-[70px] shrink-0">{log.time}</span>
          <span className={`w-[45px] shrink-0 ${levelColor[log.level] || 'text-idpxyz-textMuted'}`}>{log.level}</span>
          <span className="text-idpxyz-text">{log.msg}</span>
        </div>
      ))}
    </div>
  );
}

function CommentsContent() {
  const comments = [
    { time: '14:30', user: '王丽', text: '客户来电要求更新收货地址，需要确认是否需要重新分配仓库。' },
    { time: '10:15', user: '刘建', text: '已审核风险标记，新客户账户但支付已验证，谨慎放行。' },
  ];
  return (
    <div className="space-y-2">
      {comments.map((c, i) => (
        <div key={i} className="flex gap-2 text-[12px]">
          <div className="w-6 h-6 rounded-full bg-idpxyz-accent/20 text-idpxyz-accent text-[9px] font-bold flex items-center justify-center shrink-0">{c.user[0]}</div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-idpxyz-accent font-medium text-[11px]">{c.user}</span>
              <span className="text-idpxyz-textMuted text-[10px] font-mono">{c.time}</span>
            </div>
            <div className="text-idpxyz-text mt-0.5">{c.text}</div>
          </div>
        </div>
      ))}
    </div>
  );
}
