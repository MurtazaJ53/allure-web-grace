
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Settings as SettingsIcon, Volume2, Bell, Zap } from 'lucide-react';
import { useLocalStorage } from '@/hooks/useLocalStorage';

interface QuickSettingsState {
  notifications: boolean;
  soundEffects: boolean;
  autoSave: boolean;
  animationSpeed: number;
  focusMode: boolean;
}

const defaultSettings: QuickSettingsState = {
  notifications: true,
  soundEffects: true,
  autoSave: true,
  animationSpeed: 50,
  focusMode: false,
};

export function QuickSettings() {
  const [settings, setSettings] = useLocalStorage<QuickSettingsState>('quick-settings', defaultSettings);

  const updateSetting = <K extends keyof QuickSettingsState>(
    key: K,
    value: QuickSettingsState[K]
  ) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  return (
    <Card className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm border-0 shadow-xl">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <SettingsIcon className="w-5 h-5" />
          Quick Settings
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Notifications Toggle */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Bell className="w-4 h-4 text-gray-600 dark:text-gray-400" />
            <Label htmlFor="notifications" className="text-sm font-medium">
              Notifications
            </Label>
          </div>
          <Switch
            id="notifications"
            checked={settings.notifications}
            onCheckedChange={(checked) => updateSetting('notifications', checked)}
          />
        </div>

        {/* Sound Effects Toggle */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Volume2 className="w-4 h-4 text-gray-600 dark:text-gray-400" />
            <Label htmlFor="soundEffects" className="text-sm font-medium">
              Sound Effects
            </Label>
          </div>
          <Switch
            id="soundEffects"
            checked={settings.soundEffects}
            onCheckedChange={(checked) => updateSetting('soundEffects', checked)}
          />
        </div>

        {/* Auto Save Toggle */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Zap className="w-4 h-4 text-gray-600 dark:text-gray-400" />
            <Label htmlFor="autoSave" className="text-sm font-medium">
              Auto Save
            </Label>
          </div>
          <Switch
            id="autoSave"
            checked={settings.autoSave}
            onCheckedChange={(checked) => updateSetting('autoSave', checked)}
          />
        </div>

        {/* Animation Speed Slider */}
        <div className="space-y-2">
          <Label className="text-sm font-medium">Animation Speed</Label>
          <Slider
            value={[settings.animationSpeed]}
            onValueChange={([value]) => updateSetting('animationSpeed', value)}
            max={100}
            min={0}
            step={10}
            className="w-full"
          />
          <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400">
            <span>Slow</span>
            <span>Fast</span>
          </div>
        </div>

        {/* Focus Mode Toggle */}
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <Label htmlFor="focusMode" className="text-sm font-medium">
              Focus Mode
            </Label>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Hide distracting elements
            </p>
          </div>
          <Switch
            id="focusMode"
            checked={settings.focusMode}
            onCheckedChange={(checked) => updateSetting('focusMode', checked)}
          />
        </div>
      </CardContent>
    </Card>
  );
}
