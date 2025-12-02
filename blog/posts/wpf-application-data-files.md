# WPF Application Data 파일

![WPF](https://miro.medium.com/v2/resize:fit:1272/1*JoXc43sxqIa4oYIfwbFX7w.png)

아래 공식사이트를 참고하여 작성하였습니다.
[https://learn.microsoft.com/en-us/dotnet/desktop/wpf/app-development/wpf-application-resource-content-and-data-files?view=netframeworkdesktop-4.8](https://learn.microsoft.com/en-us/dotnet/desktop/wpf/app-development/wpf-application-resource-content-and-data-files?view=netframeworkdesktop-4.8)

Microsoft Windows application은 실행파일 이외에 data 파일들을 포함하고 있습니다. (XAML, image, video, dll 라이브러리 등)
이러한 data 들을 설정하고, 사용하는 방식을 3가지 형태로 구분하여 지원합니다.

## Resource Files

빌드 시 실행 바이너리 파일에 포함되는 Data (XAML 등)

```xml
<Project xmlns="http://schemas.microsoft.com/developer/msbuild/2003" ... >
  ...
  <ItemGroup>
    <Resource Include="ResourceFile.xaml" />
  </ItemGroup>
  ...
</Project>
```

## Content Files

빌드 시 실행 바이너리 파일에 포함되지는 않지만 metadata 에 정보가 정의되어 있고 프로그램 실행 시 필요한 Data (dll 라이브러리 등)
실행 파일을 재 빌드하지 않고 데이터를 업데이트 할 수 있는 장점이 있다

```xml
<Project xmlns="http://schemas.microsoft.com/developer/msbuild/2003" ... >
  ...
  <ItemGroup>
    <Content Include="ContentFile.xaml">
      <CopyToOutputDirectory>PreserveNewest</CopyToOutputDirectory>
    </Content>
  </ItemGroup>
  ...
</Project>
```

### 빌드 폴더 Copy Options

Always (빌드시 항상 복사)
PreserveNewest (Data파일이 없을 경우에만)

## Site of Origin Files

빌드 시 Data 파일이 존재하지 않고 런타임 시 Data가 결정될 경우에 사용

```xml
<Project xmlns="http://schemas.microsoft.com/developer/msbuild/2003" ... >
  ...
  <None Include="PageSiteOfOriginFile.xaml">
    <CopyToOutputDirectory>Always</CopyToOutputDirectory>
  </None>
  ...
</Project>
```

---

*작성일: 2023년 9월 19일*
