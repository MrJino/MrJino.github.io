## 프로젝트 색상 변경하기

상단 메뉴 창에서 아래 경로로 진입하여 설정창을 열어 편집을 합니다.

- `Preferences → Settings → Workspace 탭 → Color Customizations`
- 기존에 설정된 `settings.json`이 있다면 파일에서 바로 설정해도 됩니다.

```json
{
  "workbench.colorCustomizations": {
    "editor.background": "#1E1E1E",
    "editor.foreground": "#D4D4D4",
    "activityBar.background": "#181818",
    "statusBar.background": "#007ACC",
    "titleBar.activeBackground": "#2d6d58",
    "titleBar.inactiveBackground": "#2d6d58"
  }
}
```

각 항목은 다음 영역의 색상을 지정합니다.

- `editor.background`: 편집기 배경색
- `editor.foreground`: 편집기 기본 글자색
- `activityBar.background`: 액티비티 바 배경색
- `statusBar.background`: 상태 표시줄 배경색
- `titleBar.activeBackground`: 타이틀바 활성화상태 배경색
- `titleBar.inactiveBackground`: 타이틀바 비활성화상태 배경색

설정을 저장하면 변경한 색상이 VS Code에 바로 반영됩니다.
