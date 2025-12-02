# .NET 기반 WPF앱에서 Winform 사용하기

![WPF Add Item](https://miro.medium.com/v2/resize:fit:1400/1*08xD4YeCXecnwUf-aq8HIA.png)

WPF 기반의 윈도우 애플리케이션을 만들때 가끔씩 Winform 을 사용하는 Window를 추가해야 할 때가 있습니다.

이때, Add Item을 통해 Window를 추가하려고 해도 메뉴상에 Winform 이 보이지 않아 당황하게 됩니다. ;;

![당황](https://miro.medium.com/v2/resize:fit:436/1*yCKBJDJ4FSt27EzDJBb-Sw.jpeg)

## 해결 방법

해결 방법은 의외로 간단한데요.
프로젝트 설정 파일에 WindowsForm 사용옵션만 추가해주면 됩니다.

### 프로젝트 파일(.csproj) 수정

프로젝트 파일을 열어서 `PropertyGroup` 섹션에 다음 항목을 추가합니다:

```xml
<UseWindowsForms>true</UseWindowsForms>
```

### 전체 설정 예시

```xml
<PropertyGroup>
  <OutputType>WinExe</OutputType>
  <TargetFramework>net6.0-windows</TargetFramework>
  <Nullable>enable</Nullable>
  <UseWPF>true</UseWPF>
  <UseWindowsForms>true</UseWindowsForms>
  <Platforms>x64</Platforms>
  <AssemblyName>KioskManager</AssemblyName>
</PropertyGroup>
```

## 핵심 포인트

- `<UseWPF>true</UseWPF>` - WPF 사용 설정
- `<UseWindowsForms>true</UseWindowsForms>` - Windows Forms 사용 설정

이 두 설정을 함께 사용하면 하나의 프로젝트에서 WPF와 Windows Forms를 모두 사용할 수 있습니다.

---

그럼, 즐코딩 하세요~!

*작성일: 2023년 10월 26일*
