### gl-card

#### Slots

| Name | Description |
| -- | -- |
| title | - |
| footer | - |

#### Attributes

| Attribute | Description | Type	| Accepted Values | Default |
| -- | -- | -- | -- | -- |
| header | - | Object | - | - |
| footer | - | Object | - | - |
| badge | - | String | - | null |
| title | - | Object | - | - |
| state | - | String | ''/no/success/warn | - |
| footerClass | - | String | - | - |
| iconClass | - | String | - | - |
| capitalize | - | Boolean | - | true |



### gl-switch

#### Attributes

| Attribute | Description | Type	| Accepted Values | Default |
| -- | -- | -- | -- | -- |
| cssClass | - | String | - | - |
| disabled | - | Boolean | - | - |
| size | - | String | default/medium/small | medium |
| value | - | String/Boolean/Number | - | - |
| activeValue | - | String/Boolean/Number | - | true |
| inactiveValue | - | String/Boolean/Number | - | - |



### gl-button

#### Attributes

| Attribute | Description | Type	| Accepted Values | Default |
| -- | -- | -- | -- | -- |
| cssClass | - | String | - | - |
| disabled | - | Boolean | - | - |
| type | - | String | default/primary/connect/error/abort/success | default |
| round | - | String | oval/left/right | oval |
| loading | - | Boolean | - | - |
| textTransform | - | String | capitalize/uppercase/lowercase | capitalize |
| plain | - | Boolean | - | - |



### gl-pwd-strength

#### Attributes

| Attribute | Description | Type	| Accepted Values | Default |
| -- | -- | -- | -- | -- |
| password | - | String | - | - |



### gl-upload-card

#### Attributes

| Attribute | Description | Type	| Accepted Values | Default |
| -- | -- | -- | -- | -- |
| isReadFile | - | Boolean | - | - |
| path | - | String | - | - |
| isVpn | - | Boolean | - | - |
| allowType | - | String | - | - |
| errorText | - | String | - | - |
| maxSize | - | Number | - | - |



### gl-title

#### Slots

| Name | Description |
| -- | -- |
| badge | - |

#### Attributes

| Attribute | Description | Type	| Accepted Values | Default |
| -- | -- | -- | -- | -- |
| title | - | Object | - | - |
| badge | - | Object | - | - |
| capitalize | - | Boolean | - | true |



### gl-wireless-signal

#### Attributes

| Attribute | Description | Type	| Accepted Values | Default |
| -- | -- | -- | -- | -- |
| signal | - | Number/null/undefined | - | -50 |
| lock | - | Boolean | - | - |
| band | - | String | - | - |
| size | - | Number/String | - | 15 |
| disabled | - | Boolean | - | - |



### gl-scan-wifi

#### Attributes

| Attribute | Description | Type	| Accepted Values | Default |
| -- | -- | -- | -- | -- |
| savedAp | - | Array | - | [] |
| scanWifi | - | Array | - | [] |
| scanState | - | Number | - | - |
| lockBand | - | String | - | - |
| isBridge | - | Boolean | - | - |



### gl-time-pick

#### Attributes

| Attribute | Description | Type	| Accepted Values | Default |
| -- | -- | -- | -- | -- |
| timeKey | - | String/Number | - | - |
| value | - | String | - | - |
| disabled | - | Boolean | - | - |



### gl-line-chart

#### Attributes

| Attribute | Description | Type	| Accepted Values | Default |
| -- | -- | -- | -- | -- |
| id | - | String/Number | - | - |
| labels | - | Array | - | [] |
| value | - | Array | - | [] |
| values | - | Array | - | [] |
| datasetLabels | - | Array | - | [] |
| backgroundColor | - | String/Array | - | - |
| borderColor | - | String/Array | - | - |
| borderWidth | - | Number | - | 2 |
| height | - | String/Number | - | 75 |
| fill | - | Boolean | - | true |
| x | - | Object | - | { display: false } |
| y | - | Object | - | { display: false, min: 0 } |
| plugins | - | Object | - | {} |



### gl-week-select

#### Attributes

| Attribute | Description | Type	| Accepted Values | Default |
| -- | -- | -- | -- | -- |
| value | - | Array | - | [] |



### gl-ellipsis-tooltip

#### Slots

| Name | Description |
| -- | -- |
| content | - |
| default | - |

#### Attributes

| Attribute | Description | Type	| Accepted Values | Default |
| -- | -- | -- | -- | -- |
| content | - | String | - | - |
| placement | - | String | - | top |



### gl-tips

#### Slots

| Name | Description |
| -- | -- |
| tips | - |
| customAction | - |

#### Attributes

| Attribute | Description | Type	| Accepted Values | Default |
| -- | -- | -- | -- | -- |
| state | - | String | error/info/success/warning/default | info |
| iconClass | - | String | - | - |
| sign | - | String | none/icon/status | icon |
| tips | - | String | - | - |



### gl-dropdown

#### Attributes

| Attribute | Description | Type	| Accepted Values | Default |
| -- | -- | -- | -- | -- |
| label | - | Object | - | - |
| dropdownKey | - | String/Number | - | - |
| disabled | - | Boolean | - | - |
| placement | - | String | left/right/center | center |
| wrapMaxHeight | - | Number | - | 300 |
| wrapClass | - | String | - | - |
| trigger | - | String | click/hover | click |



### gl-dropdown-item

#### Slots

| Name | Description |
| -- | -- |
| default | - |

#### Attributes

| Attribute | Description | Type	| Accepted Values | Default |
| -- | -- | -- | -- | -- |
| actived | - | Boolean | - | - |
| disabled | - | Boolean | - | - |
| divided | - | Boolean | - | - |



### gl-toggle

#### Attributes

| Attribute | Description | Type	| Accepted Values | Default |
| -- | -- | -- | -- | -- |
| value | - | String/Number | - | - |
| disabled | - | Boolean | - | - |



### gl-toggle-item

#### Attributes

| Attribute | Description | Type	| Accepted Values | Default |
| -- | -- | -- | -- | -- |
| value | - | String/Number | - | - |
| label | - | String/Number | - | - |
| disabled | - | Boolean | - | - |



### gl-radio-group

#### Attributes

| Attribute | Description | Type	| Accepted Values | Default |
| -- | -- | -- | -- | -- |
| value | - | Number/String/Boolean | - | - |
| size | - | String | default/small | default |



### gl-radio

#### Attributes

| Attribute | Description | Type	| Accepted Values | Default |
| -- | -- | -- | -- | -- |
| label | - | Number/String/Boolean | - | - |
| value | - | Number/String/Boolean | - | - |
| disabled | - | Boolean | - | false |
