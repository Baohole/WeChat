> [!IMPORTANT]
> Please leave a ⭐ if you like this project.

# WeChat 😺

A Real-Time web-based MERN Chat App.
{ Development in Progress }

> [!NOTE]  
> This project uses the frontend from TwinkConnect. It includes a set of ready-made UI components and a clean, modern design, which makes building the user interface faster and easier. The TwinkConnect frontend is flexible and easy to customize, so it can be adjusted to fit the project’s specific needs.

![WeChat](https://i.imgur.com/CMGzVa3.png)

## ✅ Site Status

Live At: <a href="https://wechat.vercel.app">Vercel | WeChat</a>

> [!WARNING]  
> **It is highly recommended to test this application locally** rather than relying on the deployed version. The deployed version uses Vercel's free tier, which cannot guarantee a consistent experience due to cold starts, timeout limitations, and other free-tier constraints.

## 💻 Tech Stack

![MongoDB](https://img.shields.io/badge/mongodb-001E2B?style=for-the-badge&logo=mongodb&logoColor=00ED64)
![Express](https://img.shields.io/badge/Express.js-404D59?style=for-the-badge)
![React.JS](https://img.shields.io/badge/React.js-%2320232a.svg?style=for-the-badge&logo=react&logoColor=%2361DAFB)
![Node.JS](https://img.shields.io/badge/Node.js-43853D?style=for-the-badge&logo=node.js&logoColor=white)
![MUI](https://img.shields.io/static/v1?style=for-the-badge&message=MUI&color=007FFF&logo=MUI&logoColor=FFFFFF&label=)
![Socket.io](https://img.shields.io/badge/Socket.io-black?style=for-the-badge&logo=socket.io&badgeColor=010101)
![React Redux](https://img.shields.io/badge/Redux-593D88?style=for-the-badge&logo=redux&logoColor=white)
![React Router](https://img.shields.io/static/v1?style=for-the-badge&message=React+Router&color=CA4245&logo=React+Router&logoColor=FFFFFF&label=)
![Cloudinary](https://img.shields.io/static/v1?style=for-the-badge&message=Cloudinary&color=3448C5&logo=Cloudinary&logoColor=FFFFFF&label=)
![React Hook Form](https://img.shields.io/badge/React%20Hook%20Form-%23EC5990.svg?style=for-the-badge&logo=reacthookform&logoColor=white)
![JWT](https://img.shields.io/badge/JWT-black?style=for-the-badge&logo=JSON%20web%20tokens)
![Swiper](https://img.shields.io/static/v1?style=for-the-badge&message=Swiper&color=6332F6&logo=Swiper&logoColor=FFFFFF&label=)
![Framer Motion](https://img.shields.io/static/v1?style=for-the-badge&message=Framer+Motion&color=242424&logo=Framer&logoColor=FFFFFF&label=)
![Git](https://img.shields.io/badge/git-%23F05033.svg?style=for-the-badge&logo=git&logoColor=white)
![GitHub](https://img.shields.io/static/v1?style=for-the-badge&message=GitHub&color=181717&logo=GitHub&logoColor=FFFFFF&label=)
![NodeMailer](https://img.shields.io/static/v1?style=for-the-badge&message=NodeMailer&color=1CB674&logo=Node.js&logoColor=FFFFFF&label=)
![Google Analytics](https://img.shields.io/static/v1?style=for-the-badge&message=Google+Analytics&color=E37400&logo=Google+Analytics&logoColor=FFFFFF&label=)

## 📃 Features List

#### 👦🏻 User Features

    - Real-time one-to-one chat

    - reCAPTCHA support

    - Robust authentication system with dynamic flow

    - OTP based verification and password reset functionality

    - 3 Social logins methods (Google, GitHub & LinkedIn)

    - Disposable email check

    - Highly responsive UI

    - Dark/Light theme support

    - 6 different color presets

    - Custom movable sidebar for theme settings

    - Profile section with image cropper & drag-n-drop support

    - Search friends with infinite scrolling

    - Emoji support

    - Real-time online status

    - Real-time typing... message

    - Dynamic friends contact menu

#### 🧑🏻‍💻 Developer Features

<b>Backend:</b>

    - Added security options (Rate Limit, XSS Protection, Sanitization, URL Encoding & more)

    - Dynamic server & routes error handling

    - Dedicted folder structure

    - JWT Middlewares for both APIs & Socket based requests

    - Cloudinary file upload system with auto folder structuring

    - Access & Refresh token with cookies support

    - Structured DB with pre save & validations

    - And much more

<b>Frontend:</b>

    - Custom axios setup for easier API calling

    - Custom error interceptors for axios error handlings

    - Redux toolkit with persist

    - Custom hooks

    - Auto refresh tokens & auto token verification

    - Google Ananlytics support

    - Dynamic routing with lazy loading

    - Custom loader

    - Customized theme with dedicated folder structuring

    - React Hook Form with Yup form validations

    - Custom utils folder

    - And much more

## 👾 Installation

### Backend:

From root directory, move to the backend using command

```bash
$ cd backend/
```

Install dependencies for server

```bash
$ npm install
```

Setup .env using `.env copy` file

```bash
$ located in backend/
```

Start the backend using nodemon

```bash
$ npm start
```

### Frontend:

From root directory, move to the frontend using command

```bash
$ cd frontend/
```

Install dependencies for frontend

```bash
$ npm install -f
```

Setup .env using `.env copy` file

```bash
$ located in frontend/
```

Runs frontend on localhost(React App)

```bash
$ npm start
```

Creates an optimized production build

```bash
$ npm run build
```

## 🪜 Folder Structure

<details>
  <summary>Main Structure</summary>

  ```
├──backend/
│   ├── ...
├──frontend/
│   ├── ...
├── .gitignore
├── LICENSE
├── Readme.md
  ```
</details>

<details>
  <summary>Backend</summary>

```
├── backend/
│   ├── config/
│   │   ├── apilink.ts
│   │   ├── database.ts
│   ├── controllers/
│   │   ├── auth.controller.ts
│   │   ├── conversations.controller.ts
│   │   ├── friends.controller.ts
│   │   ├── messages.controller.ts
│   │   ├── user.controller.ts
│   ├── interface/
│   │   ├── request.inf.ts
│   ├── mailtemplates/
│   │   ├── reset.ts
│   ├── middleware/
│   │   ├── auth.mdlw.ts
│   │   ├── auth.middleware.ts
│   │   ├── socket.mdlw.ts
│   ├── models/
│   │   ├── Conversation.models.ts
│   │   ├── FriendRequest.models.ts
│   │   ├── Message.models.ts
│   │   ├── Otp.models.ts
│   │   ├── User.models.ts
│   ├── public/
│   │   ├── index.html
│   ├── routes/
│   │   ├── auth.routes.ts
│   │   ├── conversations.routes.ts
│   │   ├── friends.routes.ts
│   │   ├── index.routes.ts
│   │   ├── message.routes.ts
│   │   ├── user.routes.ts
│   ├── services/
│   │   ├── AuthServ.services.ts
│   │   ├── getAllConver.services.ts
│   │   ├── Mailer.services.ts
│   │   ├── Socket.services.ts
│   │   ├── TokenServ.services.ts
│   ├── utils/
│   │   ├── cloudinary.utils.ts
│   │   ├── CreatOtp.utils.ts
│   │   ├── FilterObjs.utils.ts
│   │   ├── GenToken.utils.ts
│   ├── .env
│   ├── index.ts
│   ├── package.json
│   ├── socket.ts
│   ├── tsconfig.json
│   ├── vercel.json
```
</details>

<details>
<summary>Frontend</summary>

```
├── frontend/
│   ├── public/
│   │   ├── favicon.ico
│   │   ├── index.html
│   │   ├── logo.ico
│   │   ├── manifest.json
│   │   ├── robots.txt
│   │   ├── sitemap.xml
│   │   ├── sitemap.txt
│   │   ├── _redirects
│   ├── src/
│   │   ├── assets/
│   │   │   ├── backgrounds/
│   │   │   │   ├── catDoodle.png
│   │   │   │   ├── catDoodle2.png
│   │   │   │   ├── catDoodle3.png
│   │   │   ├── icons/
│   │   │   │   ├── flags/
│   │   │   │   │   ├── flag_am.svg
│   │   │   │   │   ├── flag_en.png
│   │   │   │   │   ├── flag_en.svg
│   │   │   │   │   ├── flag_fr.png
│   │   │   │   │   ├── flag_fr.svg
│   │   │   │   │   ├── flag_hi.png
│   │   │   │   │   ├── flag_hi.svg
│   │   │   │   │   ├── flag_ja.svg
│   │   │   │   │   ├── flag_vn.svg
│   │   │   │   ├── logo/
│   │   │   │   │   ├── TwinkConnect.png (legacy)
│   │   │   │   │   ├── TwinkConnectSub.png (legacy)
│   │   │   │   │   ├── VaibhawMishra.ico (legacy)
│   │   │   │   │   ├── WeChat.png
│   │   │   │   │   ├── WeChatSub.png
│   │   │   ├── Illustration/
│   │   │   │   ├── Animations/
│   │   │   │   │   ├── Cat404.json
│   │   │   │   │   ├── CatAnimation1.json
│   │   │   │   │   ├── CatAnimation2.json
│   │   │   │   │   ├── CatAnimation3.json
│   │   │   │   │   ├── CatAnimation4.json
│   │   │   │   │   ├── CatAnimation5.json
│   │   │   │   │   ├── ChillingVibes.json
│   │   │   │   │   ├── HangingBuddy.json
│   │   │   │   │   ├── NoResultsFound.json
│   │   │   │   │   ├── SearchNotFound.json
│   │   │   │   ├── NoChat.js
│   │   ├── components/
│   │   │   ├── animate/
│   │   │   │   ├── varients/
│   │   │   │   │   ├── actions.js
│   │   │   │   │   ├── background.js
│   │   │   │   │   ├── bounce.js
│   │   │   │   │   ├── container.js
│   │   │   │   │   ├── fade.js
│   │   │   │   │   ├── flip.js
│   │   │   │   │   ├── index.js
│   │   │   │   │   ├── path.js
│   │   │   │   │   ├── rotate.js
│   │   │   │   │   ├── scale.js
│   │   │   │   │   ├── slide.js
│   │   │   │   │   ├── transition.js
│   │   │   │   │   ├── zoom.js
│   │   │   │   ├── DialogAnimate.js
│   │   │   │   ├── FabButtonAnimate.js
│   │   │   │   ├── features.js
│   │   │   │   ├── IconButtonAnimate.js
│   │   │   │   ├── index.js
│   │   │   │   ├── MotionContainer.js
│   │   │   │   ├── MotionLazyContainer.js
│   │   │   │   ├── MotionViewport.js
│   │   │   │   ├── TextAnimate.js
│   │   │   ├── hook-form/
│   │   │   │   ├── FormProvider.js
│   │   │   │   ├── index.js
│   │   │   │   ├── RHFOtp.js
│   │   │   │   ├── RHFTextField.js
│   │   │   │   ├── RHFUpload.js
│   │   │   ├── Image/
│   │   │   │   ├── getRatio.js
│   │   │   │   ├── Image.js
│   │   │   │   ├── index.js
│   │   │   ├── PageComponents/
│   │   │   │   ├── ContactPage/
│   │   │   │   │   ├── FriendsComponents/
│   │   │   │   │   │   ├── FriendsSubComps/
│   │   │   │   │   │   │   ├── index.js
│   │   │   │   │   │   │   ├── UserCard.js
│   │   │   │   │   │   │   ├── UsersSearchResults.js
│   │   │   │   │   │   ├── FriendRequests.js
│   │   │   │   │   │   ├── index.js
│   │   │   │   │   │   ├── SearchUsers.js
│   │   │   │   │   │   ├── SentRequests.js
│   │   │   │   │   ├── ContactList.js
│   │   │   │   │   ├── FriendsMenu.js
│   │   │   │   │   ├── index.js
│   │   │   │   ├── GeneralAppPage/
│   │   │   │   │   ├── ChatElements/
│   │   │   │   │   │   ├── AllChatElement.js
│   │   │   │   │   │   ├── ChatSearchResults.js
│   │   │   │   │   │   ├── OnlineChatElement.js
│   │   │   │   │   ├── ConversationElements/
│   │   │   │   │   │   ├── ConvoSubElements/
│   │   │   │   │   │   │   ├── ChatInput.js
│   │   │   │   │   │   │   ├── MessageContainer.js
│   │   │   │   │   │   ├── ConversationFooter.js
│   │   │   │   │   │   ├── ConversationHeader.js
│   │   │   │   │   │   ├── ConversationMain.js
│   │   │   │   │   │   ├── index.js
│   │   │   │   │   ├── ChatsList.js
│   │   │   │   │   ├── Conversation.js
│   │   │   │   │   ├── index.js
│   │   │   │   ├── OnlineFriendsElement/
│   │   │   │   │   ├── OnlineFriendsElement.js
│   │   │   │   ├── ProfilePage/
│   │   │   │   │   ├── ProfilePage.js
│   │   │   │   ├── UserProfileDrawer/
│   │   │   │   │   ├── UserDrawerComps/
│   │   │   │   │   │   ├── UDMainComps/
│   │   │   │   │   │   │   ├── RemoveFriendDialog.js
│   │   │   │   │   │   ├── index.js
│   │   │   │   │   │   ├── UserDrawerHeader.js
│   │   │   │   │   │   ├── UserDrawerMain.js
│   │   │   │   │   ├── UserProfileDrawer.js
│   │   │   ├── Search/
│   │   │   │   ├── index.js
│   │   │   │   ├── Search.js
│   │   │   │   ├── SearchIconWrapper.js
│   │   │   │   ├── StyledInputBase.js
│   │   │   ├── settings/
│   │   │   │   ├── drawer/
│   │   │   │   │   ├── BoxMask.js
│   │   │   │   │   ├── Developer.js
│   │   │   │   │   ├── index.js
│   │   │   │   │   ├── SettingColorPresets.js
│   │   │   │   │   ├── SettingContrast.js
│   │   │   │   │   ├── SettingDirection.js
│   │   │   │   │   ├── SettingFullscreen.js
│   │   │   │   │   ├── SettingLayout.js
│   │   │   │   │   ├── SettingMode.js
│   │   │   │   │   ├── SettingStretch.js
│   │   │   │   │   ├── ToggleButton.js
│   │   │   │   ├── index.js
│   │   │   │   ├── ThemeColorPresets.js
│   │   │   │   ├── ThemeContrast.js
│   │   │   │   ├── ThemeLocalization.js
│   │   │   │   ├── ThemeRtlLayout.js
│   │   │   ├── upload/
│   │   │   │   ├── preview/
│   │   │   │   │   ├── AvatarCropper.js
│   │   │   │   │   ├── AvatarPreview.js
│   │   │   │   │   ├── cropImage.js
│   │   │   │   ├── index.js
│   │   │   │   ├── UploadAvatar.js
│   │   │   ├── AntSwitch.js
│   │   │   ├── Iconify.js
│   │   │   ├── LoadingScreen.js
│   │   │   ├── NoData.js
│   │   │   ├── StyledBadge.js
│   │   │   ├── ThemeSwitch.js
│   │   ├── contexts/
│   │   │   ├── SettingsContext.js
│   │   ├── data/
│   │   │   ├── index.js
│   │   ├── hooks/
│   │   │   ├── useLocales.js
│   │   │   ├── useLocalStorage.js
│   │   │   ├── useResponsive.js
│   │   │   ├── useSettings.js
│   │   ├── layouts/
│   │   │   ├── auth/
│   │   │   │   ├── index.js
│   │   │   ├── dashboard/
│   │   │   │   ├── index.js
│   │   │   │   ├── Sidebar.js
│   │   │   ├── docs/
│   │   │   │   ├── index.js
│   │   ├── pages/
│   │   │   ├── auth/
│   │   │   │   ├── ForgotPassword.js
│   │   │   │   ├── Login.js
│   │   │   │   ├── Register.js
│   │   │   │   ├── ResetPassword.js
│   │   │   │   ├── Verify.js
│   │   │   │   ├── WelcomePage.js
│   │   │   ├── dashboard/
│   │   │   │   ├── Contact.js
│   │   │   │   ├── GeneralApp.js
│   │   │   │   ├── GroupChat.js
│   │   │   │   ├── Profile.js
│   │   │   │   ├── Settings.js
│   │   │   ├── docs/
│   │   │   │   ├── TnC.js
│   │   │   ├── 404.js
│   │   ├── redux/
│   │   │   ├── slices/
│   │   │   │   ├── actions/
│   │   │   │   │   ├── authActions.js
│   │   │   │   │   ├── chatActions.js
│   │   │   │   │   ├── contactActions.js
│   │   │   │   │   ├── userActions.js
│   │   │   │   ├── authSlice.js
│   │   │   │   ├── chatSlice.js
│   │   │   │   ├── contactSlice.js
│   │   │   │   ├── index.js
│   │   │   │   ├── userSlice.js
│   │   │   ├── rootReducer.js
│   │   │   ├── store.js
│   │   ├── routes/
│   │   │   ├── index.js
│   │   │   ├── paths.js
│   │   ├── sections/
│   │   │   ├── auth/
│   │   │   │   ├── AuthSocial.js
│   │   │   │   ├── ForgotPasswordForm.js
│   │   │   │   ├── LoginForm.js
│   │   │   │   ├── RegisterForm.js
│   │   │   │   ├── ResetPasswordForm.js
│   │   │   │   ├── VerifyForm.js
│   │   │   ├── settings/
│   │   │   │   ├── ProfileForm.js
│   │   │   │   ├── Shortcuts.js
│   │   │   │   ├── ThemeDialog.js
│   │   ├── theme/
│   │   │   ├── overrides/
│   │   │   │   ├── Accordion.js
│   │   │   │   ├── Alert.js
│   │   │   │   ├── Autocomplete.js
│   │   │   │   ├── Avatar.js
│   │   │   │   ├── Backdrop.js
│   │   │   │   ├── Badge.js
│   │   │   │   ├── Breadcrumbs.js
│   │   │   │   ├── Button.js
│   │   │   │   ├── ButtonGroup.js
│   │   │   │   ├── Card.js
│   │   │   │   ├── Checkbox.js
│   │   │   │   ├── Chip.js
│   │   │   │   ├── ControlLabel.js
│   │   │   │   ├── CssBaseline.js
│   │   │   │   ├── CustomIcons.js
│   │   │   │   ├── DataGrid.js
│   │   │   │   ├── Dialog.js
│   │   │   │   ├── Drawer.js
│   │   │   │   ├── Fab.js
│   │   │   │   ├── index.js
│   │   │   │   ├── Input.js
│   │   │   │   ├── Link.js
│   │   │   │   ├── List.js
│   │   │   │   ├── LoadingButton.js
│   │   │   │   ├── Menu.js
│   │   │   │   ├── Pagination.js
│   │   │   │   ├── Paper.js
│   │   │   │   ├── Popover.js
│   │   │   │   ├── Progress.js
│   │   │   │   ├── Radio.js
│   │   │   │   ├── Rating.js
│   │   │   │   ├── Select.js
│   │   │   │   ├── Skeleton.js
│   │   │   │   ├── Slider.js
│   │   │   │   ├── Stepper.js
│   │   │   │   ├── SvgIcon.js
│   │   │   │   ├── Switch.js
│   │   │   │   ├── Table.js
│   │   │   │   ├── Tabs.js
│   │   │   │   ├── Timeline.js
│   │   │   │   ├── ToggleButton.js
│   │   │   │   ├── Tooltip.js
│   │   │   │   ├── TreeView.js
│   │   │   │   ├── Typography.js
│   │   │   ├── breakpoints.js
│   │   │   ├── index.js
│   │   │   ├── palette.js
│   │   │   ├── shadows.js
│   │   │   ├── typography.js
│   │   ├── utils/
│   │   │   ├── axios.js
│   │   │   ├── axiosInterceptors.js
│   │   │   ├── createAvatar.js
│   │   │   ├── cssStyles.js
│   │   │   ├── flattenArray.js
│   │   │   ├── formatNumber.js
│   │   │   ├── formatTime.js
│   │   │   ├── getColorName.js
│   │   │   ├── getColorPresets.js
│   │   │   ├── getFileData.js
│   │   │   ├── getFontValue.js
│   │   │   ├── getOtherUser.js
│   │   │   ├── helmetHandler.js
│   │   │   ├── jwt.js
│   │   │   ├── scrollToBottom.js
│   │   │   ├── socialLoginHelpers.js
│   │   │   ├── socket.js
│   │   │   ├── timeFormatter.js
│   │   │   ├── truncateText.js
│   │   │   ├── uuidv4.js
│   │   ├── App.js
│   │   ├── config.js
│   │   ├── index.css
│   │   ├── index.js
│   ├── .env copy
│   ├── package-lock.json
│   ├── package.json
│   ├── README.md
```
</details>

## ⚠️ Local Testing Recommendation

Due to the limitations of Vercel's free tier, it's highly recommended to test this application locally:

1. Free tier deployments have cold starts which can cause delays in API responses
2. Socket connections may experience disruptions on free hosting
3. Backend services may timeout on complex operations
4. Local testing provides a more reliable and responsive experience

For the best experience and to fully evaluate the application's capabilities, please follow the installation instructions above to run the app on your local machine.

<div align="center">
<img src="https://komarev.com/ghpvc/?username=Baohole&&style=for-the-badge" align="center" />
</div>

<br/>

---
