'use client';

import { useState, useEffect } from 'react';
import { VSCodeLayout } from '@/components/layout';
import { Bell, Check, Loader2 } from 'lucide-react';
import * as notificationsApi from '@/lib/api/notifications.service';
import type { Notification } from '@/lib/api/types';

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const response = await notificationsApi.getNotifications();
      setNotifications(response.data);

      const countResponse = await notificationsApi.getUnreadCount();
      setUnreadCount(countResponse.count);
    } catch (error) {
      console.error('加载通知失败', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleMarkAsRead = async (id: string) => {
    try {
      await notificationsApi.markAsRead(id);
      // 重新加载数据
      loadData();
    } catch (error) {
      console.error('标记失败', error);
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      await notificationsApi.markAllAsRead();
      loadData();
    } catch (error) {
      console.error('标记失败', error);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await notificationsApi.deleteNotification(id);
      loadData();
    } catch (error) {
      console.error('删除失败', error);
    }
  };

  return (
    <VSCodeLayout>
      <div className="p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <Bell className="w-6 h-6 text-vscode-accent" />
            <div>
              <h1 className="text-2xl font-semibold text-vscode-text-primary">
                通知中心
              </h1>
              <p className="text-vscode-text-secondary text-sm">
                {unreadCount > 0 && `${unreadCount} 条未读通知`}
              </p>
            </div>
          </div>
          {unreadCount > 0 && (
            <button
              onClick={handleMarkAllAsRead}
              className="px-3 py-1.5 text-sm bg-vscode-bg-secondary border border-vscode-border rounded hover:bg-vscode-bg-hover transition-colors text-vscode-text-primary"
            >
              全部标为已读
            </button>
          )}
        </div>

        {/* Notifications List */}
        {isLoading ? (
          <div className="flex items-center justify-center py-12 text-vscode-text-secondary">
            <Loader2 className="w-5 h-5 animate-spin mr-2" />
            加载中...
          </div>
        ) : notifications.length > 0 ? (
          <div className="space-y-2">
            {notifications.map((notification) => (
              <div
                key={notification.id}
                className={`p-4 bg-vscode-bg-secondary rounded border transition-colors ${
                  !notification.isRead
                    ? 'border-vscode-accent bg-vscode-bg-active'
                    : 'border-vscode-border'
                }`}
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      {!notification.isRead && (
                        <span className="w-2 h-2 rounded-full bg-vscode-accent"></span>
                      )}
                      <h3 className="text-base font-semibold text-vscode-text-primary">
                        {notification.title}
                      </h3>
                    </div>
                    <p className="text-sm text-vscode-text-secondary mb-2">
                      {notification.content}
                    </p>
                    <p className="text-xs text-vscode-text-tertiary">
                      {new Date(notification.createdAt).toLocaleString('zh-CN')}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    {!notification.isRead && (
                      <button
                        onClick={() => handleMarkAsRead(notification.id)}
                        className="p-2 rounded hover:bg-vscode-bg-hover transition-colors"
                        title="标为已读"
                      >
                        <Check className="w-4 h-4 text-vscode-text-secondary" />
                      </button>
                    )}
                    <button
                      onClick={() => handleDelete(notification.id)}
                      className="p-2 rounded hover:bg-vscode-bg-hover transition-colors text-vscode-text-tertiary hover:text-red-400"
                      title="删除"
                    >
                      ✕
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          /* Empty State */
          <div className="text-center py-12">
            <Bell className="w-16 h-16 mx-auto text-vscode-text-tertiary mb-4" />
            <p className="text-vscode-text-secondary">
              暂无通知
            </p>
          </div>
        )}
      </div>
    </VSCodeLayout>
  );
}
