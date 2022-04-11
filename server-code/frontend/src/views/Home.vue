<template>
  <div class="all">
    <Header>mBrainAligner Demo</Header>
    <div class="top">
      <div class="top-wrapper">
        <div class="top-left"></div>
        <!-- 注册邮箱模块 -->
        <div class="register-mail">
          <!-- 注册邮箱modal框 -->
          <Modal v-model="regModalStatus" :title="modalMailTitle">
            <label for="mail">{{ emailModalNote }}</label>
            <Input
              v-model="regInfo.userEmail"
              placeholder="Please input your Email address"
              class="mail"
              name="mail"
              @keyup.enter.native="enterFunc"
            ></Input>

            <div slot="footer">
              <Button
                class="reg-cancel"
                type="text"
                size="default"
                @click="regCancel"
                >Cancel</Button
              >
              <Button
                class="reg-ok"
                type="primary"
                size="default"
                @click="regOk"
                >Submit</Button
              >
            </div>
          </Modal>
        </div>
      </div>
    </div>

    <div class="bottom">
      <!-- 右侧图片显示区 -->
      <div class="right">
        <div class="right-top">
          <div class="right-top-text">IMAGE</div>
        </div>
        <div class="right-bottom">
          <div class="right-bottom-text">3D VIEW</div>
        </div>
      </div>

      <!-- 左侧选择区域 -->
      <div class="left">
        <Form :model="info" :label-width="200">
          <!-- sample data or user upload data  -->
          <FormItem class="border-common">
            <div class="firstDataBtn">
              <label for="first-data" class="labelTitleStyle"
                >1. Input image</label
              >
              <RadioGroup v-model="firstDataSelectionValue" name="first-data">
                <Radio label="user upload data"></Radio>
                <Radio label="sample data"></Radio>
              </RadioGroup>
            </div>
          </FormItem>

          <!-- 2. Image modality-sample 区域 start -->
          <div class="sample-area border-common" v-show="sampleAreaStatus">
            <div class="sample-area-wrapper">
              <label for="second-data" class="imageModalityLabel"
                >2. Image modality</label
              >

              <!-- <FormItem label=""> -->
              <!-- 选择sample option 类型 -->
              <div class="sample-radio">
                <RadioGroup v-model="sampleDataOptionValue">
                  <Radio
                    v-for="(item, index) in sampleDataOption"
                    :value="item"
                    :key="index"
                    :label="item"
                  >
                  </Radio>
                </RadioGroup>
              </div>
              <!-- Image modality-user upload -->

              <!-- 下载还是配参 -->
              <div class="sample-direct">
                <div class="sample-download-btn">
                  <!-- Download registration results -->
                  <Button
                    type="success"
                    @click="downloadSample"
                    :style="downloadSampleStyle"
                    v-model="clickDownloadSampleStatus"
                    >Download registration results</Button
                  >
                  <!-- Redo registration -->
                  <Button
                    type="success"
                    @click="chooseSampleParams"
                    :style="redoStyle"
                    >Redo registration</Button
                  >
                </div>
                <!-- 文字说明 -->
                <div class="secondBoxText">
                  Note: You can download the registration results directly or
                  redo registration with customized parameters.
                </div>
                <!-- 
              <div class="sample-params-btn">
              
            </div> -->

                <!-- download sample 进度条 -->
                <!-- <div class="sample-progress">
                  <FormItem v-show="sampleProgressStatus">
                    <div class="show-sample-progress">
                      <Progress :percent="sampleDownloadPercent" />
                    </div>
                  </FormItem> -->
                <!-- </div> -->
              </div>
            </div>
          </div>
          <!-- 2. Image modality-sample 区域 end -->

          <!-- 2. Image modality-user upload start-->
          <div class="user-area border-common" v-show="userImageModalityStatus">
            <div class="user-area-wrapper">
              <label for="user-second-data" class="imageModalityLabel"
                >2. Image modality</label
              >
              <!-- 选择sample option 类型 -->
              <div class="sample-radio">
                <RadioGroup v-model="userDataOptionValue">
                  <Radio
                    v-for="(item, index) in userDataOption"
                    :value="item"
                    :key="index"
                    :label="item"
                  >
                  </Radio>
                </RadioGroup>
              </div>

              <!-- 下载还是配参 -->
              <div class="user-direct">
                <div class="user-select-params-btn">
                  <!-- Selection parameters -->
                  <Button
                    type="success"
                    @click="chooseSampleParams"
                    :style="redoStyle"
                    >Selection parameters</Button
                  >
                </div>
              </div>
            </div>
          </div>
          <!-- 2. Image modality-user upload  end-->

          <div class="paramsAndPrintArea" v-show="paramsAreaStatus">
            <!-- 蒙版区域 marker-->
            <div class="marker" v-show="showMarkerStatus"></div>

            <!-- 被蒙区域 -->
            <div class="be-marker">
              <!-- 选择参数区域 -->
              <div class="params-area border-common">
                <div class="label-wrapper">
                  <label for="third-data" class="paramsModalityLabel"
                    >3. Parameters</label
                  >
                </div>
                <!-- user upload data -->
                <FormItem label="User Upload Data" v-show="userShowStatus">
                  <!-- 上传文件 -->
                  <Upload
                    class="upload-component"
                    ref="upload"
                    :on-success="
                      (rep, file, fileList) =>
                        handleSuccess(rep, file, fileList)
                    "
                    :on-error="
                      (error, file, fileList) =>
                        handleError(error, file, fileList)
                    "
                    :default-file-list="uploadedFileList"
                    :action="actionUrl"
                    :show-upload-list="true"
                  >
                    <!-- :on-remove="handleRemove" -->
                    <Button
                      class="upload-choose-file"
                      icon="ios-cloud-upload-outline"
                      type="primary"
                      >user upload data</Button
                    >
                  </Upload>

                  <!-- mouse brain data -->
                  <!-- <Select
                    v-show="userShowStatus"
                    v-model="info.userUploadData"
                    placeholder="select mouse brain params"
                  >
                    <Option value="mouse brain">mouse brain</Option>
                    <Option value="other species brain" disabled
                      >other species brain</Option
                    >
                  </Select> -->
                </FormItem>

                <!-- foreground threshold -->
                <FormItem label="Foreground Threshold (Optional)">
                  <InputNumber
                    v-show="userSampleShowStatus"
                    v-model="foregroundThreshold"
                    placeholder="foreground threshold"
                    style="width: 100px"
                    class="th"
                  />
                </FormItem>

                <!-- global registration -->
                <FormItem label="Global Registration *">
                  <CheckboxGroup
                    v-show="userSampleShowStatus"
                    v-model="globalRegistration"
                    @on-change="checkglobalRegistrationChange"
                  >
                    <Checkbox label="auto-RPM" disabled></Checkbox>
                    <Checkbox label="auto-FFD"></Checkbox>
                    <Checkbox label="manual" disabled></Checkbox>
                  </CheckboxGroup>
                </FormItem>

                <!-- local registration -->
                <FormItem label="Local Registration (Optional)">
                  <!-- 是否选择使用 local reg -->
                  <FormItem
                    label="Using Local or Not"
                    class="optTitle"
                    v-show="userSampleShowStatus"
                  >
                    <!-- 选择 yes no -->
                    <RadioGroup
                      v-model="yesOrNotValue"
                      @on-change="localOptChange"
                      class="optTitle"
                    >
                      <Radio label="yes" border> </Radio>
                      <Radio label="no" border> </Radio>
                    </RadioGroup>
                  </FormItem>

                  <FormItem
                    v-for="(value, key) in localRegistration"
                    :key="key"
                    :label="key"
                    class="local-form-item"
                  >
                    <Input
                      v-model="localRegistration[key]"
                      :placeholder="key"
                      style="width: 100px"
                      :disabled="localRegDisabled"
                    />
                    <!-- shuoming 文字 -->
                    <span class="illustration"
                      ><strong class="illustration-key">{{ key }}: </strong
                      >{{ illustrationText[key] }}</span
                    >
                  </FormItem>
                </FormItem>

                <!-- landmarks density -->
                <!-- <FormItem
                  label="Landmarks Density (Optional)"
                  v-show="localShowStatus"
                > -->
                <FormItem label="Landmarks Density (Optional)">
                  <RadioGroup v-model="landmarksDensityChange">
                    <Radio
                      v-for="(item, index) in landmarksDensity"
                      :value="item"
                      :key="index"
                      :label="item"
                      :disabled="localRegDisabled"
                    ></Radio>
                  </RadioGroup>

                  <!-- Run start -->
                  <Button
                    type="primary"
                    @click="clickRunCmd"
                    v-model="runClickStatus"
                    :style="runStyle"
                    >Run Command</Button
                  >
                  <div class="runText">
                    Note: Single brain registration will finish in about 0.5
                    hours (If "Landmarks Density" is chosen as "low", and other
                    default parameters are chosen).
                  </div>
                  <!-- Run end -->
                </FormItem>
              </div>

              <!-- 打印区域 -->
              <div class="print-area border-common">
                <!-- <label for="fourth-data" class="logModalityLabel">Log</label> -->
                <label for="fourth-data" class="logModalityLabel"
                  >Progress</label
                >
                <!-- print cmd -->
                <!-- <FormItem class="printBtn" v-show="userSampleShowStatus">
                  <Button type="primary" @click="printFunc"
                    >Print Command</Button
                  >
                  <div>
                    <Input
                      v-model="cmdText"
                      type="textarea"
                      :autosize="{ minRows: 10, maxRows: 10 }"
                      class="printBox"
                    ></Input>
                  </div>
                </FormItem> -->

                <!-- execute cmd start-->
                <!-- <FormItem class="submitBtn" v-show="userSampleShowStatus"> -->
                <!-- log area start-->
                <!-- <div class="log-area"> -->
                <!-- <div>
                    <Button type="primary" @click="logClick">Log </Button>
                  </div> -->
                <!-- <div>
                      <Input
                        v-model="logText"
                        type="textarea"
                        :autosize="{ minRows: 16, maxRows: 16 }"
                        class="logBox"
                        name="fourth-data"
                      ></Input>
                    </div> -->
                <div class="log-progress" v-show="showLogStatus">
                  <Progress
                    :percent="90"
                    :stroke-width="20"
                    status="active"
                    hide-info
                  />
                </div>
              </div>
              <!-- log area end-->
              <!-- </FormItem> -->
            </div>
          </div>
        </Form>
      </div>
    </div>
  </div>
</template>

<script>
// import Header from "@/components/Header";
import api from "@/utils/api.js";
import Header from "../components/Header.vue";
import axios from "@/axios/index";

export default {
  components: {
    Header,
  },
  data() {
    return {
      currentFolderNameGlobal: "", //当前的文件夹名
      clickDownloadSampleStatus: false, // 点击 download sample 前为false， 点击后为true；
      clickDownloadResultStatus: false, //点击 download result 前为false， 点击后为true；
      userImageModalityStatus: "", // 2. image modality是否显示
      showLogStatus: false, // 是否显示日志进度条
      localRegDisabled: false, //local params是否可以点击
      downloadSampleStyle: "", // download sample 默认无样式
      downloadSampleStyleValue: "background:#45F919;border:5px solid #45F919;", //download点击成功后的样式
      runStyle: "", // run 按钮style的默认值
      runStyleValue: "background:#45F919;border:5px solid #45F919;", // run 按钮点击后的style值
      redoStyleValue: "background:#45F919;border:5px solid #45F919;", // 切换redo的style 值
      redoStyle: "", // 绑定的双向数据的变量名
      showMarkerStatus: true, //是否显示蒙版
      emailModalNote:
        "Note: sample data registration results will be sent to your email later.", //email modal 对话框note
      modalMailTitle: "", //提示输入邮件的modal框的title
      registerBtnStatus: true, //是否显示register 按钮
      logOutStatus: false, //是否显示logout按钮
      regModalStatus: false, //是否显示对话框
      regInfo: {
        userEmail: "",
      }, //注册信息： 邮箱
      landmarksDensityDefault: "low",
      landmarksDensityChange: "", // landmarksDensityChange
      yesOrNotValue: "", //yes no 默认值
      paramsAreaStatus: false, // 是否显示参数区域
      sampleAreaStatus: false, //是否显示sample 下载或选择参数
      sampleDataNextStatus: false, // sampleDataNextStatus
      userSampleShowStatus: false, //默认不显示 sample 或 user 时显示
      userDataOptionValue: "fMOST", //user 下 data option
      userDataOption: ["fMOST", "LSFM", "VISoR", "MRI", "Others"], //user下option选项
      sampleDataOptionValue: "fMOST", //value of sample data change
      sampleDataOption: ["fMOST", "LSFM", "VISoR", "MRI"], //sample data 4 options
      userShowStatus: false, //sample data时不显示， user upload 时 显示;
      showResultProgressStatus: false, //result下载进度条显示状态
      sampleProgressStatus: false, //sample下载进度条显示状态
      logStatus: false, //日志是否显示
      logText: "", //日志文本
      //是否点击过run command, 默认没有点击过，false
      runClickStatus: false,
      // 下载result文件的按钮
      downloadResStyle: "background-color:grey;opacity:0.6",
      downloadStatusOk: "opacity:1", //可以下载
      // form表单绑定的info
      info: {
        firstDataSelection: [],
        userUploadData: [],
        globalRegistration: [],
        localRegistration: {},
        landmarksDensity: [""],
      },
      localShowStatus: false,
      firstDataSelection: ["sample data", "user upload data"],
      userUploadData: ["mouse brain", "other species brain"],
      globalRegistration: ["auto-RPM", "auto-FFD"], // 默认选中
      landmarksDensity: ["low", "middle", "high"],
      localSelectUser: "Select_modal=1" + "\n",
      localSelectSample: {
        fMOST: "Select_modal=0" + "\n",
        LSFM: "Select_modal=1" + "\n",
        MRI: "Select_modal=1" + "\n",
        VISoR: "Select_modal=1" + "\n",
      },
      localRegistration: {
        max_iteration_number: "1500",
        smoothness_constraint_outer_initial: "1",
        smoothness_constraint_inner_initial: "1",
        smoothness_constraint_outer_end: "50",
        smoothness_constraint_inner_end: "50",
        kernel_radius: "10",
        search_radius: "5",
        interval_save: "500",
        interval_region_constraint: "25",
        interval_global_constraint: "50",
        multiscale: "2",
      },
      illustrationText: {
        max_iteration_number: "Number of iterative optimization.",
        smoothness_constraint_outer_initial:
          "The initial constraint value of outer contour landmarkers(the larger the value, the stronger the constraint).",
        smoothness_constraint_inner_initial:
          "The initial constraint value of  inner contour landmarkers(the larger the value, the stronger the constrain).",
        smoothness_constraint_outer_end:
          "The minimum value for annealing constraints of outer contour landmarkers.",
        smoothness_constraint_inner_end:
          "The minimum value for annealing constraints of  inner contour landmarkers.",
        kernel_radius: "Feature extraction scope.",
        search_radius: "Search matching landmarkers scope.",
        interval_save: "Frequency of saving result files",
        interval_region_constraint: "Frequency of region_constraint.",
        interval_global_constraint: "Frequency of global_constraint.",
        multiscale: "Selection of scale in multi-scale registration.",
      },
      localRegOptionUser: {
        //user 下 local registration
        fMOST: {
          max_iteration_number: "1500",
          smoothness_constraint_outer_initial: "300",
          smoothness_constraint_inner_initial: "500",
          smoothness_constraint_outer_end: "50",
          smoothness_constraint_inner_end: "50",
          kernel_radius: "10",
          search_radius: "5",
          interval_save: "500",
          interval_region_constraint: "25",
          interval_global_constraint: "50",
          multiscale: "2",
        },
        Others: {
          max_iteration_number: "1500",
          smoothness_constraint_outer_initial: "300",
          smoothness_constraint_inner_initial: "500",
          smoothness_constraint_outer_end: "50",
          smoothness_constraint_inner_end: "50",
          kernel_radius: "10",
          search_radius: "5",
          interval_save: "500",
          interval_region_constraint: "25",
          interval_global_constraint: "50",
          multiscale: "2",
        },
        LSFM: {
          max_iteration_number: "1500",
          smoothness_constraint_outer_initial: "1",
          smoothness_constraint_inner_initial: "100",
          smoothness_constraint_outer_end: "1",
          smoothness_constraint_inner_end: "10",
          kernel_radius: "10",
          search_radius: "5",
          interval_save: "500",
          interval_region_constraint: "25",
          interval_global_constraint: "50",
          multiscale: "2",
        },
        MRI: {
          max_iteration_number: "1500",
          smoothness_constraint_outer_initial: "100",
          smoothness_constraint_inner_initial: "1",
          smoothness_constraint_outer_end: "20",
          smoothness_constraint_inner_end: "1",
          kernel_radius: "10",
          search_radius: "5",
          interval_save: "500",
          interval_region_constraint: "25",
          interval_global_constraint: "50",
          multiscale: "2",
        },
        VISoR: {
          max_iteration_number: "1500",
          smoothness_constraint_outer_initial: "1",
          smoothness_constraint_inner_initial: "500",
          smoothness_constraint_outer_end: "1",
          smoothness_constraint_inner_end: "50",
          kernel_radius: "10",
          search_radius: "5",
          interval_save: "500",
          interval_region_constraint: "25",
          interval_global_constraint: "50",
          multiscale: "2",
        },
      },
      localRegOptionSample: {
        // sample 对应四个选项对应的 local registion
        fMOST: {
          max_iteration_number: "1500",
          smoothness_constraint_outer_initial: "1",
          smoothness_constraint_inner_initial: "1",
          smoothness_constraint_outer_end: "1",
          smoothness_constraint_inner_end: "1",
          kernel_radius: "10",
          search_radius: "5",
          interval_save: "500",
          interval_region_constraint: "25",
          interval_global_constraint: "50",
          multiscale: "1",
        },
        LSFM: {
          max_iteration_number: "1500",
          smoothness_constraint_outer_initial: "1",
          smoothness_constraint_inner_initial: "100",
          smoothness_constraint_outer_end: "1",
          smoothness_constraint_inner_end: "10",
          kernel_radius: "10",
          search_radius: "5",
          interval_save: "500",
          interval_region_constraint: "25",
          interval_global_constraint: "50",
          multiscale: "2",
        },
        MRI: {
          max_iteration_number: "1500",
          smoothness_constraint_outer_initial: "100",
          smoothness_constraint_inner_initial: "1",
          smoothness_constraint_outer_end: "20",
          smoothness_constraint_inner_end: "1",
          kernel_radius: "10",
          search_radius: "5",
          interval_save: "500",
          interval_region_constraint: "25",
          interval_global_constraint: "50",
          multiscale: "2",
        },
        VISoR: {
          max_iteration_number: "1500",
          smoothness_constraint_outer_initial: "1",
          smoothness_constraint_inner_initial: "500",
          smoothness_constraint_outer_end: "1",
          smoothness_constraint_inner_end: "50",
          kernel_radius: "10",
          search_radius: "5",
          interval_save: "500",
          interval_region_constraint: "25",
          interval_global_constraint: "50",
          multiscale: "2",
        },
      },
      // actionUrl: "http://127.0.0.1:3000/api/upload", //上传文件目标地址
      // targetIp: "http://170.106.83.3",
      actionUrl: "http://101.76.160.87/api/upload",
      uploadedFileList: [], //已上传的文件列表，用于再次上传时，清空
      nextSelectionStatus: false, // 是否显示下一级选择区域
      // uploadImgName: "", // 上传图片的文件名称
      ////////////////////// global start //////////////////////////////
      globalCmdParams: [], // global sample cmd
      globalUserCmdParams: [], // global user
      localSampleCmdParams: [], // local sample cmd
      localUserCmdParams: [], // local user
      globalP: "-p r+f", //global -p
      globalTh: "-d 30", //global -d
      foregroundThreshold: 0,
      foregroundThresholdGlobal: {
        fMOST: 1,
        LSFM: 70,
        MRI: 20,
        VISoR: 20,
        define: 30,
        Others: 30,
      },
      foregroundThresholdGlobalUser: {
        fMOST: 30,
        LSFM: 70,
        MRI: 20,
        VISoR: 20,
        define: 30,
        Others: 30,
      },
      // linux path////////////////////////////////////////////////////////////////
      globalExeFix:
        "/qulab/ubuntu/mBrainAligner/dist/linux_bin/global_registration", //exe 命令
      globalFFix:
        "-f /qulab/ubuntu/mBrainAligner/examples/target/CCF_25_u8_xpad.v3draw", //global F
      globalCFix: "-c /qulab/ubuntu/mBrainAligner/examples/target/CCF_mask.v3draw", // global c
      globalMFixSample: {
        fMOST:
          "-m /qulab/ubuntu/mBrainAligner/examples/subject/fMOST_18458_raw.v3draw",
        LSFM: "-m /qulab/ubuntu/mBrainAligner/examples/subject/LSFM_raw.v3draw",
        MRI: "-m /qulab/ubuntu/mBrainAligner/examples/subject/MRI_raw.v3draw",
        VISoR: "-m /qulab/ubuntu/mBrainAligner/examples/subject/VISoR_raw.v3draw",
      }, // global m sample
      globalMFixUserVarible:
        "-m /qulab/ubuntu/mBrainAligner/results/user_upload", // 上传xx.v3draw文件的路径变量
      globalMFixUser: "",
      globalOSample: {
        fMOST: "-o /qulab/ubuntu/mBrainAligner/results/user_sample_result/fMOST",
        LSFM: "-o /qulab/ubuntu/mBrainAligner/results/user_sample_result/LSFM",
        MRI: "-o /qulab/ubuntu/mBrainAligner/results/user_sample_result/MRI",
        VISoR: "-o /qulab/ubuntu/mBrainAligner/results/user_sample_result/VISoR",
      },
      globalOUserVariable:
        "-o /qulab/ubuntu/mBrainAligner/results/user_result", //global user 输出路径变量
      globalOUser: "", // global user 输出路径最终值

      /////////////////////// global end ////////////////////////////////
      //////////////////////// local start ///////////////////
      localExeFix:
        "/qulab/ubuntu/mBrainAligner/dist/linux_bin/local_registration", // local exe
      localGFix: "-g /qulab/ubuntu/mBrainAligner/examples/target/", // local g
      localPSample: {
        fMOST: "-p /qulab/ubuntu/mBrainAligner/examples/config/fMOST_config.txt",
        LSFM: "-p /qulab/ubuntu/mBrainAligner/examples/config/LSFM_config.txt",
        MRI: "-p /qulab/ubuntu/mBrainAligner/examples/config/MRI_config.txt",
        VISoR: "-p /qulab/ubuntu/mBrainAligner/examples/config/VISoR_config.txt",
        define:
          "-p /qulab/ubuntu/mBrainAligner/examples/config/mouse_brain_initial_config.txt", //用户自定义参数生成的config
      }, //local p
      localPUser:
        "-p /qulab/ubuntu/mBrainAligner/examples/config/mouse_brain_initial_config.txt",
      localMSample: {
        fMOST: "-m /qulab/ubuntu/mBrainAligner/examples/subject/fMOST_segmentation/",
        LSFM: "",
        MRI: "",
        VISoR: "",
      }, // local m
      localSSample: {
        fMOST: "-s /qulab/ubuntu/mBrainAligner/results/user_sample_result/fMOST",
        LSFM: "-s /qulab/ubuntu/mBrainAligner/results/user_sample_result/LSFM",
        MRI: "-s /qulab/ubuntu/mBrainAligner/results/user_sample_result/MRI",
        VISoR: "-s /qulab/ubuntu/mBrainAligner/results/user_sample_result/VISoR",
      }, // local s sample
      localSUserVariable:
        "-s /qulab/ubuntu/mBrainAligner/results/user_result",//local s user
      localLFix: {
        low: "-l /qulab/ubuntu/mBrainAligner/examples/target/target_landmarks/low_landmarks.marker",
        middle:
          "-l /qulab/ubuntu/mBrainAligner/examples/target/target_landmarks/middle_landmarks.marker",
        high: "-l /qulab/ubuntu/mBrainAligner/examples/target/target_landmarks/high_landmarks.marker",
      }, // local l
      localOSample: {
        fMOST: "-o /qulab/ubuntu/mBrainAligner/results/user_sample_result/fMOST",
        LSFM: "-o /qulab/ubuntu/mBrainAligner/results/user_sample_result/LSFM",
        MRI: "-o /qulab/ubuntu/mBrainAligner/results/user_sample_result/MRI",
        VISoR: "-o /qulab/ubuntu/mBrainAligner/results/user_sample_result/VISoR",
      }, // local o
      
      //////////////////////// local end ///////////////////
      configTextStart: "Select_modal=1" + "\n",
      configText: "",
      cmdText: "", // 动态cmd语句
      sampleFileSize: "", // samplefilesize大小
      sampleDownloadPercent: 0, // 下载 sample data 百分比
      resultFileSize: "", // result文件夹的大小
      resultDownloadPercent: 0, // 下载result data 百分比
      firstDataSelectionValue: "sample data", // sample data or user upload data
      currentFileTime: "", // 当前记录
      currentUploadImg: "", // 当前上传图片
      currentOPath: "", //最终输出路径
    };
  },
  mounted() {
    this.$nextTick(() => {
      ////mount 显示 sample data start
      //选择 sample data 时
      //切换first data时， 清空选项
      // 0清空img
      this.uploadedFileList = [];

      //1.radio
      this.sampleDataOptionValue = "fMOST";

      // 2. image modality
      this.userImageModalityStatus = false; // 默认sample data 下 不显示user 的image modality

      //2.-d
      if (this.firstDataSelectionValue == "sample data") {
        this.foregroundThreshold =
          this.foregroundThresholdGlobal[this.sampleDataOptionValue];
      } else if (this.firstDataSelectionValue == "user upload data") {
        //初始化时，-d
        this.foregroundThreshold = 30;
      }

      //3.global reg
      this.globalRegistration = ["auto-RPM", "auto-FFD"];

      //4.local reg
      this.yesOrNotValue = "no";

      // local选项关闭
      this.localRegDisabled = true;

      //5. mounted landmark
      this.landmarksDensityChange = this.landmarksDensityDefault;

      //6是否显示paramsAreaStatus
      this.paramsAreaStatus = false;

      //7当前时间
      this.currentFileTime = "";
      //8 清空 this.globalCmdParams
      this.globalCmdParams = [];
      //9 清空this.globalUserCmdParams
      this.globalUserCmdParams = [];

      // 10 清空cmdText
      this.cmdText = "";

      // 11.切换恢复默认值
      this.localRegistration = {
        max_iteration_number: "1500",
        smoothness_constraint_outer_initial: "1",
        smoothness_constraint_inner_initial: "1",
        smoothness_constraint_outer_end: "50",
        smoothness_constraint_inner_end: "50",
        kernel_radius: "10",
        search_radius: "5",
        interval_save: "500",
        interval_region_constraint: "25",
        interval_global_constraint: "50",
        multiscale: "2",
      };

      // 赋值， 后面拼接cmd的分叉
      this.firstDataSelectionValue = "sample data";

      // 清空所有local参数列表
      this.localSampleCmdParams = [];
      this.localUserCmdParams = [];
      // console.log("111111111111111111");
      // 更新run command 状态
      this.runClickStatus = false;
      // this.logStatus = false;

      //sample进度条关闭
      this.sampleProgressStatus = false;

      // result 进度条关闭
      this.showResultProgressStatus = false;
      this.sampleAreaStatus = true;
      // 显示状态/////////////////////////////////
      this.userShowStatus = false;
      this.userSampleShowStatus = false;
      // this.sampleDataNextStatus = true; //展开
      ///////////////////////////////////////

      ///显示参数区域 start
      // 是否显示paramsAreaStatus
      this.paramsAreaStatus = !this.paramsAreaStatus;

      // 点击 chooseSampleParams 开关参数显示
      this.userSampleShowStatus = !this.userSampleShowStatus;

      // // 拼接 global sample 参数
      this.globalCmdParams = [
        this.globalExeFix,
        this.globalFFix,
        this.globalCFix,
        this.globalMFixSample[this.sampleDataOptionValue],
        this.globalP,
        this.globalOSample[this.sampleDataOptionValue],
        this.globalTh,
      ];
      console.log(
        "chooseSampleParams, this.globalCmdParams:",
        this.globalCmdParams
      );
    });
  },
  computed: {
    //监听userUploadData
    userUploadDataChange() {
      return this.info.userUploadData;
    },
  },
  watch: {
    //watch firstDataSelectionValue
    firstDataSelectionValue(val) {
      // 点击下载按钮的状态恢复
      this.clickDownloadSampleStatus = false;
      this.runClickStatus = false;

      // download sample btn 颜色恢复
      this.downloadSampleStyle = "";
      //redo颜色恢复
      this.redoStyle = "";

      // 1.选择 redo param  恢复显示蒙版
      this.showMarkerStatus = true;

      // local registration 恢复no
      this.localRegDisabled = true;

      // 恢复no选项
      this.yesOrNotValue = "no";
      console.log("++++this.showMarkerStatus:", this.showMarkerStatus);

      if (val == "sample data") {
        //选择 sample data 时
        //切换first data时， 清空选项
        // 0清空img
        this.uploadedFileList = [];
        //1.radio
        this.sampleDataOptionValue = "fMOST";
        //2.-d
        this.foregroundThreshold =
          this.foregroundThresholdGlobal[this.sampleDataOptionValue];
        //3.global reg
        this.globalRegistration = ["auto-RPM", "auto-FFD"];

        //4.local reg
        this.yesOrNotValue = "no";
        //5.landmark
        this.landmarksDensityChange = this.landmarksDensityDefault;

        //6是否显示paramsAreaStatus
        this.paramsAreaStatus = false;

        //7当前时间
        this.currentFileTime = "";

        //8 清空 this.globalCmdParams
        this.globalCmdParams = [];

        //9 清空this.globalUserCmdParams
        this.globalUserCmdParams = [];

        // 10 清空cmdText
        this.cmdText = "";

        // // 11.切换恢复默认值
        this.localRegistration =
          this.localRegOptionSample[this.sampleDataOptionValue];

        //12 local参数不显示
        this.localShowStatus = false;

        // 赋值， 后面拼接cmd的分叉
        this.firstDataSelectionValue = "sample data";
        // console.log("111111111111111111");
        // 更新run command 状态

        this.runClickStatus = false;
        // this.logStatus = false;

        this.sampleAreaStatus = true;

        // 显示状态/////////////////////////////////
        this.userShowStatus = false;

        //显示 2.Image modality
        this.userSampleShowStatus = false;
        // this.sampleDataNextStatus = true; //展开
        ///////////////////////////////////////

        ///显示参数区域 start
        // 是否显示paramsAreaStatus
        this.paramsAreaStatus = !this.paramsAreaStatus;

        // 点击 chooseSampleParams 开关参数显示
        this.userSampleShowStatus = !this.userSampleShowStatus;

        // 2.image modality - user 不显示
        this.userImageModalityStatus = false;

        // // 拼接 global sample 参数
        this.globalCmdParams = [
          this.globalExeFix,
          this.globalFFix,
          this.globalCFix,
          this.globalMFixSample[this.sampleDataOptionValue],
          this.globalP,
          this.globalOSample[this.sampleDataOptionValue],
          this.globalTh,
        ];
        console.log(
          "chooseSampleParams, this.globalCmdParams:",
          this.globalCmdParams
        );
        ///显示参数区域 end
      } else if (val == "user upload data") {
        console.log("user upload data val1111111111", val);

        //选择 user upload data 时
        //切换first data时， 清空选项
        //0. img
        this.uploadedFileList = [];

        //切换first data时， 清空选项
        //2.-d
        this.foregroundThreshold = 30;

        //3.global reg
        this.globalRegistration = ["auto-RPM", "auto-FFD"];

        //4.local reg
        this.yesOrNotValue = "no";

        //5.landmark
        this.landmarksDensityChange = this.landmarksDensityDefault;

        //7.当前时间
        this.currentFileTime = "";
        //8 清空 this.globalCmdParams
        this.globalCmdParams = [];
        //9 清空 localCmdParams

        // 10清空this.globalUserCmdParams
        this.globalUserCmdParams = [];

        // 10 清空cmdText
        this.cmdText = "";
        // 11.切换恢复默认值
        this.localRegistration = {
          max_iteration_number: "1500",
          smoothness_constraint_outer_initial: "1",
          smoothness_constraint_inner_initial: "1",
          smoothness_constraint_outer_end: "50",
          smoothness_constraint_inner_end: "50",
          kernel_radius: "10",
          search_radius: "5",
          interval_save: "500",
          interval_region_constraint: "25",
          interval_global_constraint: "50",
          multiscale: "2",
        };

        //12 local参数不显示
        this.localShowStatus = false;
        // image modality 展开
        this.userImageModalityStatus = true;
        //###
        // paramsAreaStatus
        // sampleAreaStatus
        // userSampleShowStatus

        ////////////////////////////////////显示状态
        this.sampleAreaStatus = false; //sample area 关闭
        this.paramsAreaStatus = true; //paramsAreaStatus 展开
        this.firstDataSelectionValue = "user upload data";

        this.userShowStatus = true; //展开

        this.userSampleShowStatus = true; //展开
      }
    },
    //watch userDataOptionValueChange
    userDataOptionValue(val) {
      // console.log("sampleDataOptionValue val:", val);
      this.userDataOptionValue = val;
      //1 .sample 选项改变室， 清空全局时间
      this.currentFileTime = "";

      // 按钮颜色恢复
      this.downloadSampleStyle = "";
      // this.redoStyle = "";

      //2.判断是否显示 local registion
      if (this.yesOrNotValue == "yes") {
        // this.localRegistration = this.localRegOptionSample[val];
        this.localRegistration = this.localRegOptionUser[val];
      } else {
        //1恢复默认值
        //2关闭显示框
      }
      // -d
      this.foregroundThreshold =
        this.foregroundThresholdGlobalUser[this.userDataOptionValue];
      console.log("user change, -d: ", this.foregroundThreshold);
    },
    //watch sampleDataOptionValueChange
    sampleDataOptionValue(val) {
      // console.log("sampleDataOptionValue val:", val);
      this.sampleDataOptionValue = val;
      //1 .sample 选项改变室， 清空全局时间
      this.currentFileTime = "";

      // 按钮颜色恢复
      this.downloadSampleStyle = "";
      // this.redoStyle = "";

      // run 颜色恢复
      this.runStyle = "";

      //2.判断是否显示 local registion
      if (this.yesOrNotValue == "yes") {
        this.localRegistration = this.localRegOptionSample[val];
      } else {
        //1恢复默认值
        //2关闭显示框
      }
      // -d
      this.foregroundThreshold =
        this.foregroundThresholdGlobal[this.sampleDataOptionValue];
      console.log("sample change, -d: ", this.foregroundThreshold);
    },
    // watch localRegistrationChange
    localRegistration: {
      deep: true,
      handler(val) {
        // if (this.uploadedFileList.length != 0) {
        //   // 已上传图片
        console.log(" 检测到local params有变化");
        // 清空 run 状态
        this.runClickStatus = false;

        // localRegistration 变化时清空全局时间
        this.currentFileTime = "";

        // run 颜色恢复
        this.runStyle = "";

        let valValues = Object.values(val);
        let tempText = "";
        if (valValues.indexOf("") == -1) {
          //确认没有一个参数为空情况下
          for (let key in val) {
            let line = `${key} = ${val[key]}` + "\n";
            tempText += line;
          }
          // 获取 localRegistration 的 config 文件
          // this.configText = this.configTextStart + tempText;
          if (
            this.yesOrNotValue == "yes" &&
            this.firstDataSelectionValue == "sample data"
          ) {
            let configTextStart =
              this.localSelectSample[this.sampleDataOptionValue];

            this.configText = configTextStart + tempText;
          } else if (
            this.yesOrNotValue == "yes" &&
            this.firstDataSelectionValue == "user upload data"
          ) {
            let configTextStart = this.localSelectUser;

            this.configText = configTextStart + tempText;
          } else {
            this.configText = "";
          }
          // console.log("66666666666666666666666:", this.configText);
          // this.configText = tempText;
          // 将config写入文件夹
          api.write_config(this.configText).then((res) => {});

          if (
            this.yesOrNotValue == "yes" &&
            this.firstDataSelectionValue == "sample data"
          ) {
            // yes下 任意值有变动时，更新localSampleCmdParams
            this.localSampleCmdParams = [
              this.localExeFix,
              this.localPSample.define,
              this.localSSample[this.sampleDataOptionValue],
              this.localMSample[this.sampleDataOptionValue],
              this.localLFix[val],
              this.localGFix,
              this.localOSample[this.sampleDataOptionValue],
            ];
            console.log(
              "watch localRegistration,this.localSampleCmdParams:",
              this.localSampleCmdParams
            );
          } else if (
            this.yesOrNotValue == "yes" &&
            this.firstDataSelectionValue == "user upload data"
          ) {
            // yes 下 更新 local user，
            this.localUserCmdParams = [
              this.localExeFix,
              this.localPUser,
              this.localSUser,
              this.localLFix[this.landmarksDensityChange],
              this.localGFix,
              this.globalOUser, // 此处local 与 global o 一致
            ];
            console.log(
              "localRegistration,local user, this.localUserCmdParams:",
              this.localUserCmdParams
            );
          }
        } else {
          //有参数为空
          this.$Modal.info({
            title: "",
            content: "local registration params cannot be empty !",
            okText: "Ok",
          });
        }
        // } else {
        //   // 未上传图片提示
        //   this.$Modal.info({
        //     title: "",
        //     content: "Please upload an image first !",
        //   });
        // }
      },
    },
    // watch
    landmarksDensityChange(val) {
      // 更新run command 状态
      this.runClickStatus = false;

      // result 进度条关闭
      this.showResultProgressStatus = false;

      // run 颜色恢复
      this.runStyle = "";

      // landmarksDensityChange 变化时，清空全局时间
      this.currentFileTime = "";

      if (this.firstDataSelectionValue == "sample data") {
        //local sample landmark
        this.localSampleCmdParams = [
          this.localExeFix,
          this.localPSample[this.sampleDataOptionValue],
          this.localSSample[this.sampleDataOptionValue],
          this.localMSample[this.sampleDataOptionValue],
          this.localLFix[val],
          this.localGFix,
          this.localOSample[this.sampleDataOptionValue],
        ];
        console.log(
          "watch landmark,this.localSampleCmdParams:",
          this.localSampleCmdParams
        );
      } else if (this.firstDataSelectionValue == "user upload data") {
        // local user landmark
        this.localUserCmdParams = [
          this.localExeFix,
          this.localPUser,
          this.localSUser,
          this.localLFix[val], // 根据low middle high变动
          this.localGFix,
          this.globalOUser, // 此处local 与 global o 一致
        ];
        console.log(
          "local user landmarksDensityChange,this.localUserCmdParams:",
          this.localUserCmdParams
        );

        // user upload data 下 landmark
        // if (this.uploadedFileList.length != 0) {
        //   // 更新run command 状态
        //   this.runClickStatus = false;

        //   // result 进度条关闭
        //   this.showResultProgressStatus = false;
        // } else {
        //   // 未上传图片提示
        //   this.$Modal.info({
        //     title: "",
        //     content: "Please upload an image first !",
        //   });
        // }
      }
    },
    // watch uploadImgName
    currentUploadImg(val) {
      console.log("currentUploadImg", val);
      // 图片文件名更新后，就更新m参数
      // 更新run command 状态
      this.runClickStatus = false;

      // run 颜色恢复
      this.runStyle = "";

      // result 进度条关闭
      this.showResultProgressStatus = false;
      //////////////////////////////清空
      // //0. img
      // this.uploadedFileList = [];
      //切换first data时， 清空选项
      //1.radio
      // this.sampleDataOptionValue = "";
      // //2.-d
      // this.foregroundThreshold = 30;
      //3.global reg
      this.globalRegistration = ["auto-RPM", "auto-FFD"];

      //4.local reg
      // this.yesOrNotValue = "no";
      // local registration
      this.localRegistration =
        this.localRegOptionUser[this.userDataOptionValue];
      // console.log("img++++++++++++,this.localRegistration", this.localRegistration);
      //5.landmark
      this.landmarksDensityChange = this.landmarksDensityDefault;

      this.foregroundThreshold =
        this.foregroundThresholdGlobalUser[this.userDataOptionValue];

      //7.当前时间
      this.currentFileTime = "";
    },
    // watch foreground threshold
    foregroundThreshold(val) {
      // 更新run command 状态
      this.runClickStatus = false;

      // result 进度条关闭
      this.showResultProgressStatus = false;

      // th改变时清空全局时间
      this.currentFileTime = "";

      // run 颜色恢复
      this.runStyle = "";

      // 值变动
      this.globalTh = `-d ${val}`;
      if (this.firstDataSelectionValue == "sample data") {
        // 拼接 global sample 参数
        this.globalCmdParams = [
          this.globalExeFix,
          this.globalFFix,
          this.globalCFix,
          this.globalMFixSample[this.sampleDataOptionValue],
          this.globalP,
          this.globalOSample[this.sampleDataOptionValue],
          this.globalTh,
        ];
        console.log(
          "foregroundThreshold, this.globalCmdParams:",
          this.globalCmdParams
        );
      } else if (this.firstDataSelectionValue == "user upload data") {
        // threshold 拼接 global user
        this.globalUserCmdParams = [
          this.globalExeFix,
          this.globalFFix,
          this.globalCFix,
          this.globalMFixUser,
          this.globalP,
          this.globalOUser,
          this.globalTh,
        ];
        console.log(
          "thresh, user, this.globalUserCmdParams",
          this.globalUserCmdParams
        );
      }
    },
  },
  methods: {
    // regMailEnterFunc 注册邮箱 使用 enter 键确定
    enterFunc() {
      console.log("enterFunc++++++++++++++++");
      console.log("+++++++++this.regInfo", this.regInfo.userEmail);
      this.regOk();
    },
    //
    LogOut() {
      this.registerBtnStatus = true;
      this.regInfo.userEmail = "";
      this.logOutStatus = false;
      //恢复默认值start
      // 0清空img
      this.uploadedFileList = [];
      //1.radio
      this.sampleDataOptionValue = "fMOST";
      //2.-d
      this.foregroundThreshold =
        this.foregroundThresholdGlobal[this.sampleDataOptionValue];
      //3.global reg
      this.globalRegistration = ["auto-RPM", "auto-FFD"];

      //4.local reg
      this.yesOrNotValue = "no";
      //5.landmark
      this.landmarksDensityChange = this.landmarksDensityDefault;

      //6是否显示paramsAreaStatus
      this.paramsAreaStatus = false;
      //7当前时间
      this.currentFileTime = "";
      //8 清空 this.globalCmdParams
      this.globalCmdParams = [];
      //9 清空this.globalUserCmdParams
      this.globalUserCmdParams = [];
      // 10 清空cmdText
      this.cmdText = "";
      // // 11.切换恢复默认值
      this.localRegistration =
        this.localRegOptionSample[this.sampleDataOptionValue];
      //12 local参数不显示
      this.localShowStatus = false;
      // 赋值， 后面拼接cmd的分叉
      this.firstDataSelectionValue = "sample data";
      // console.log("111111111111111111");
      // 更新run command 状态
      this.runClickStatus = false;
      // this.logStatus = false;

      //sample进度条关闭
      this.sampleProgressStatus = false;

      // result 进度条关闭
      this.showResultProgressStatus = false;
      this.sampleAreaStatus = true;
      // 显示状态/////////////////////////////////
      this.userShowStatus = false;
      this.userSampleShowStatus = false;
      // this.sampleDataNextStatus = true; //展开
      ///////////////////////////////////////

      ///显示参数区域 start
      // 是否显示paramsAreaStatus
      this.paramsAreaStatus = !this.paramsAreaStatus;

      // 点击 chooseSampleParams 开关参数显示
      this.userSampleShowStatus = !this.userSampleShowStatus;

      // // 拼接 global sample 参数
      this.globalCmdParams = [
        this.globalExeFix,
        this.globalFFix,
        this.globalCFix,
        this.globalMFixSample[this.sampleDataOptionValue],
        this.globalP,
        this.globalOSample[this.sampleDataOptionValue],
        this.globalTh,
      ];
      console.log(
        "chooseSampleParams, this.globalCmdParams:",
        this.globalCmdParams
      );
      //恢复默认值end
    },
    //注册邮箱
    registerMail() {
      this.regModalStatus = !this.regModalStatus;
      console.log("this.regModalStatus", this.regModalStatus);
      // 清空mail 信息
      this.regInfo.userEmail = "";
    },
    regOk() {
      // this.$Message.info("reg ok !");
      console.log("++++++++++++++++++++++++ reg ok:");
      //传给后端
      if (this.regInfo.userEmail) {
        api.register(this.regInfo).then((res) => {
          if (res.status == 200) {
            let data = res.data;
            let that = this;
            console.log("data: ", data);
            if (data.register_status == "true") {
              //注册成功后
              //判断如果是点击的download sample, 则调用
              //如果点击的是 download result
              if (that.clickDownloadSampleStatus) {
                //此时调用 download sample
                this.downloadSample();
              } else if (that.runClickStatus) {
                this.clickRunCmd();
              }
              // else if (that.clickDownloadResultStatus){
              //   //此时调用 download result

              // }

              // this.$Modal.success({
              //   title: "",
              //   content: "Register successfully!",
              //   okText: "Ok",
              //   onOk: () => {
              //     console.log("onok11111111111");
              //     //关闭 register 按钮
              //     that.registerBtnStatus = false;
              //     // 显示logout 按钮
              //     that.logOutStatus = true;
              //   },
              // });
            }
          }
        });
        this.regModalStatus = false;
      } else {
        this.$Modal.info({
          title: "",
          content: "Email is empty !",
          okText: "Ok",
        });
      }
    },
    regCancel() {
      //清空email 信息
      this.regInfo.userEmail = "";
      this.regModalStatus = false;
      this.logOutStatus = false;
      this.registerBtnStatus = true;
    },
    //chooseSampleParams
    chooseSampleParams() {
      // download sample 的按钮颜色恢复
      this.downloadSampleStyle = "";
      //先判断是否选择了sample data option
      if (this.sampleDataOptionValue) {
        //1.选择 redo param 去除蒙版
        this.showMarkerStatus = !this.showMarkerStatus;
        //2  显示paramsAreaStatus
        this.paramsAreaStatus = true;

        // 3 点击 chooseSampleParams 开关参数显示
        this.userSampleShowStatus = true; //显示参数

        //4 按钮颜色变绿
        if (!this.showMarkerStatus) {
          this.redoStyle = this.redoStyleValue;
        } else {
          this.redoStyle = "";
        }

        // // 拼接 global sample 参数
        this.globalCmdParams = [
          this.globalExeFix,
          this.globalFFix,
          this.globalCFix,
          this.globalMFixSample[this.sampleDataOptionValue],
          this.globalP,
          this.globalOSample[this.sampleDataOptionValue],
          this.globalTh,
        ];
        console.log(
          "chooseSampleParams, this.globalCmdParams:",
          this.globalCmdParams
        );
      } else {
        this.$Modal.info({
          title: "",
          content: "Sample data option is empty !",
        });
      }
    },
    downloadSample() {
      //redo的样式取消
      this.redoStyle = "";
      //download sample 样式取消
      this.downloadSampleStyle = "";

      // 记录click download sample 状态，用于输入邮箱后，判断调用 download sample 还是 download result
      this.clickDownloadSampleStatus = true; // 代表此时点击的是 download sample

      if (this.regInfo.userEmail) {
        //注册邮箱后
        //download sample 样式变绿
        this.downloadSampleStyle = this.downloadSampleStyleValue;
        let that = this;

        if (this.sampleDataOptionValue) {
          api.downloadSample(this.sampleDataOptionValue).then((res) => {
            console.log("downloadSample, res: ", res);
            if (res.status == 200) {
              let data = res.data;
              if (data.send_status == "true") {
                //发送邮件成功
                this.$Modal.success({
                  title: "",
                  content: `Sample data registration results have been sent to your email.Please check !<p><a>${this.regInfo.userEmail}</a></p>`,
                  okText: "Ok",
                  onOk: () => {
                    that.downloadSampleStyle = ""; // downlaod sample 按钮颜色恢复默认；
                  },
                });
              } else {
                //没有发送邮件成功
                let that = this;
                this.$Modal.info({
                  title: "",
                  content:
                    "The status of sending mail is false, Please input the correct mail address !",
                  okText: "Ok",
                  onOk: () => {
                    that.regInfo.userEmail = "";
                    that.downloadSample();
                  },
                });
              }
            }
          });
        }
      } else {
        //没有注册过邮箱
        // this.runClickStatus = false; // 没有点击download result

        // 1. 显示注册邮箱对话框
        this.regModalStatus = true;

        //2. 对话框title
        this.modalMailTitle = "Add email address";

        // 3. 选项区域保持蒙版, 显示蒙版
        this.showMarkerStatus = true;

        //4 按钮恢复颜色
        this.downloadResStyle = "";

        // this.$Modal.info({
        //   title: "Add email address",
        //   content: "Note: sample data registration results will be sent to your email later.",
        //   okText: "Ok",
        // });
        // this.$Modal.open();
      }
    },
    //logClick
    logClick() {
      //打印日志
      this.showResultProgressStatus = false;

      //  清空日志
      this.logText = "";
      if (this.currentOPath) {
        //有输出路径情况下
        let path = this.currentOPath;
        let folder_name = this.currentFolderNameGlobal;
        let that = this;
        // 显示日志进度条
        this.showLogStatus = true;

        //定时器请求log， 直到log_status = false, 停止请求
        let timer = setInterval(() => {
          api.log(path, folder_name).then((res) => {
            if (res.status == 200) {
              let logRes = res.data;
              //log 状态
              let logStatus = logRes.log_status;
              // log 文本
              let logTextRes = logRes.log_text;
              console.log("log11111111, logStatus", logStatus);
              that.logText = logTextRes;
              if (logStatus == "false") {
                //取消日志进度条
                this.showLogStatus = false;
                //run 按钮恢复点击前状态
                this.downloadSampleStyle = "";

                // 清空当前文件夹名
                this.currentFolderNameGlobal = "";

                //提示对话框邮件发送完成
                that.$Modal.success({
                  title: "Registration completed",
                  content: `Registration results have been sent to your email. Please check !<p><a>${this.regInfo.userEmail}</a></p>`,
                  okText: "Ok",
                  onOk: () => {
                    that.runStyle = ""; //run command 按钮恢复默认颜色；
                  },
                });
                clearInterval(timer); //停止请求
              }
            }
          });
        }, 5000); // 每5秒请求一次
      } else {
        this.$Modal.info({
          title: "",
          content: "No output path !",
        });
      }
    },
    // radio yes or no , methods localOptChange
    localOptChange(val) {
      // 更新run command 状态
      this.runClickStatus = false;

      // result 进度条关闭
      this.showResultProgressStatus = false;

      // yes or no 变化时，清空全局时间
      this.currentFileTime = "";

      // run 颜色恢复
      this.runStyle = "";

      if (val == "yes") {
        // // 1. 显示
        // this.localShowStatus = true;// 现在默认都显示local参数
        // yes 下 local params 所有按钮 not disable
        this.localRegDisabled = false;

        // under yes
        if (this.firstDataSelectionValue == "sample data") {
          //1 .sample + yes 下 local params 随着4个参数变换
          this.localRegistration =
            this.localRegOptionSample[this.sampleDataOptionValue];

          // 2. landmarks
          this.landmarksDensityChange = this.landmarksDensityDefault;

          // 3. yes local sample
          this.localSampleCmdParams = [
            this.localExeFix,
            this.localPSample[this.sampleDataOptionValue],
            this.localSSample[this.sampleDataOptionValue],
            this.localMSample[this.sampleDataOptionValue],
            this.localLFix[this.landmarksDensityChange],
            this.localGFix,
            this.localOSample[this.sampleDataOptionValue],
          ];
        } else if (this.firstDataSelectionValue == "user upload data") {
          // yes local user
          // 1.生成config.txt
          let tempText = "";
          //localRegistration 变动
          this.localRegistration =
            this.localRegOptionUser[this.userDataOptionValue];

          let val = this.localRegistration;
          for (let key in val) {
            let line = `${key} = ${val[key]}` + "\n";
            tempText += line;
          }
          // 获取 localRegistration 的 config 文件
          // this.configText = this.configTextStart + tempText;
          // this.configText = tempText;
          this.configText = this.localSelectUser + tempText;
          //  console.log("8888888888888888:", this.configText);
          // 将config写入文件夹
          api.write_config(this.configText).then((res) => {
            // this.$Message.success('"fMOST_config.txt" is generated !');
          });

          //2. 选择yes 拼接参数
          this.localUserCmdParams = [
            this.localExeFix,
            this.localPUser,
            this.localSUser,
            this.localLFix[this.landmarksDensityChange],
            this.localGFix,
            this.globalOUser, // 此处local 与 global o 一致
          ];
          console.log(
            "local optio change user, this.localUserCmdParams",
            this.localUserCmdParams
          );
        }
      } else if (val == "no") {
        // under no
        // local params 所有按钮disable
        this.localRegDisabled = true;
        // // 1.显示
        // this.localShowStatus = true;

        // 2. no 下 this.localRegistration 显示但是清空
        // this.localRegistration = {
        //   max_iteration_number: " ",
        //   smoothness_constraint_outer_initial: " ",
        //   smoothness_constraint_inner_initial: " ",
        //   smoothness_constraint_outer_end: " ",
        //   smoothness_constraint_inner_end: " ",
        //   kernel_radius: " ",
        //   search_radius: " ",
        //   interval_save: " ",
        //   interval_region_constraint: " ",
        //   interval_global_constraint: " ",
        //   multiscale: " ",
        // };

        //3.no下 landmark 清空
        // this.landmarksDensityChange = "";

        //4.清空local cmd 参数列表
        if (this.firstDataSelectionValue == "sample data") {
          // no + local sample
          this.localSampleCmdParams = [];
        } else {
          // no + local user
          // user参数列表清空
          this.localUserCmdParams = [];
        }
      }
    },
    // global registration change
    checkglobalRegistrationChange(data) {
      // if (this.uploadedFileList.length != 0) {
      // 已上传图片执行
      // 更新run command 状态
      this.runClickStatus = false;

      // 更新run command 状态为 false
      this.runClickStatus = false;

      // result 进度条关闭
      this.showResultProgressStatus = false;

      // global reg 变化时 清空全局时间
      this.currentFileTime = "";

      // run 颜色恢复
      this.runStyle = "";

      //如果长度为1，auto-RPM
      if (data.length == 1 && data[0] == "auto-RPM") {
        this.globalP = "";
        this.globalP = "-p r";
      } else if (data.length == 2) {
        // 此时选择 auto-FFD + auto-RPM
        this.globalP = "-p r+f";
      } else if (data.length == 0) {
        this.globalP = "";
      }
      if (this.firstDataSelectionValue == "sample data") {
        // 拼接 global sample 参数
        this.globalCmdParams = [
          this.globalExeFix,
          this.globalFFix,
          this.globalCFix,
          this.globalMFixSample[this.sampleDataOptionValue],
          this.globalP,
          this.globalOSample[this.sampleDataOptionValue],
          this.globalTh,
        ];
        console.log("this.globalP:", this.globalP);
        console.log(
          "this.globalCmdParamsglobal registration:",
          this.globalCmdParams
        );
      } else if (this.firstDataSelectionValue == "user upload data") {
        // threshold 拼接 global user
        this.globalUserCmdParams = [
          this.globalExeFix,
          this.globalFFix,
          this.globalCFix,
          this.globalMFixUser,
          this.globalP,
          this.globalOUser,
          this.globalTh,
        ];
        console.log(
          "global reg, this.globalUserCmdParams:",
          this.globalUserCmdParams
        );
      }

      // } else {
      //   // 未上传图片提示
      //   this.$Modal.info({
      //     title: "",
      //     content: "Please upload an image first !",
      //   });
      // }
    },
    // 上传图片失败
    handleError(error, file, fileList) {
      console.log("error", error);
      this.$Message.error("file is not uploaded !");
    },
    // 上传图片成功后
    handleSuccess(rep, file, fileList) {
      console.log("file: ", file);
      this.$Message.success("upload successfully");
      this.uploadImgName = file.name;
      fileList = []; //清空历史上传文件信息
      this.uploadedFileList = []; // 清空显示已上传的文件
      this.uploadedFileList.push(file); //只显示最新上传

      // 更新run command 状态为 false
      this.runClickStatus = false;

      //更改 user 下， 图片路径参数 -m
      let uploadImgName = file.name;
      this.currentUploadImg = uploadImgName;
      console.log("uploadImgName:", uploadImgName);
     

      //上传成功后 更新m参数
      this.globalMFixUser =
        this.globalMFixUserVarible + "/" + this.currentUploadImg;
      console.log("this.globalMFixUser:", this.globalMFixUser);

      // 上传文件成功后，      globalOUser: "-o mBrainAligner_data\\3rdparty_windows\\user_result",
      // let fileTitle = t${this.globalOUserVariable}/${uploadImgName}`;
      this.globalOUser = `${this.globalOUserVariable}/${uploadImgName}`;
      console.log("handle sucess, global o user: ", this.globalOUser);
      // handlesuccess拼接 global user
      this.globalUserCmdParams = [
        this.globalExeFix,
        this.globalFFix,
        this.globalCFix,
        this.globalMFixUser,
        this.globalP,
        this.globalOUser,
        this.globalTh,
      ];
      console.log(
        "handle success,  this.globalUserCmdParams",
        this.globalUserCmdParams
      );
    },
    // print command
    printFunc() {
      console.log("print func");
      // result 进度条关闭
      this.showResultProgressStatus = false;

      // 当前时间
      if (!this.currentFileTime) {
        let currentTime = this.$moment(new Date()).format("YYYYMMDDHHmm");
        this.currentFileTime = currentTime;
      }

      if (this.firstDataSelectionValue == "sample data") {
        //选项为 sample data 时,
        // global sample
        this.currentOPath =
          this.globalOSample[this.sampleDataOptionValue] +
          this.currentFileTime +
          "/";
        // // 拼接 global sample 参数
        this.globalCmdParams = [
          this.globalExeFix,
          this.globalFFix,
          this.globalCFix,
          this.globalMFixSample[this.sampleDataOptionValue],
          this.globalP,
          this.currentOPath,
          this.globalTh,
        ];

        // 拼接local sample
        if (this.yesOrNotValue == "yes") {
          this.localSampleCmdParams = [
            this.localExeFix,
            this.localPSample.define,
            this.localSSample[this.sampleDataOptionValue] +
              this.currentFileTime +
              "/global.v3draw",
            this.localMSample[this.sampleDataOptionValue],
            this.localLFix[this.landmarksDensityChange],
            this.localGFix,
            this.localOSample[this.sampleDataOptionValue] +
              this.currentFileTime +
              "/",
          ];
        } else {
          this.localSampleCmdParams = [];
        }
        console.log("printFunc, this.globalCmdParams:", this.globalCmdParams);
        // global sample
        let globalSampleCmdText = this.globalCmdParams.join(" ");

        //local sample
        let localSampleCmdText = this.localSampleCmdParams.join(" ");
        console.log(
          "print: this.localSampleCmdParams",
          this.localSampleCmdParams
        );

        // 总命令
        this.cmdText =
          "global: " +
          globalSampleCmdText +
          "\n\n" +
          "local: " +
          localSampleCmdText;

        console.log("print sample cmd: ", this.cmdText);
      } else if (this.firstDataSelectionValue == "user upload data") {
        if (this.uploadedFileList.length != 0) {
          // 选项为 user upload data
          this.currentOPath = this.globalOUser + this.currentFileTime + "/"; // 最终输出路径

          //1.判断是否上传图片
          // global user
          this.globalUserCmdParams = [
            this.globalExeFix,
            this.globalFFix,
            this.globalCFix,
            this.globalMFixUser,
            this.globalP,
            this.currentOPath,
            this.globalTh,
          ];
          if (this.yesOrNotValue == "yes") {
            this.localSUser = `${this.localSUserVariable}/${this.currentUploadImg}${this.currentFileTime}/global.v3draw`;

            //local user
            this.localUserCmdParams = [
              this.localExeFix,
              this.localPUser,
              this.localSUser,
              this.localLFix[this.landmarksDensityChange],
              this.localGFix,
              this.currentOPath, // 此处local 与 global o 一致
            ];
          } else {
            this.localUserCmdParams = [];
          }

          // 列表中字符串拼接成一条命令,// global user
          let globalSampleCmdText = this.globalUserCmdParams.join(" ");

          //local sample
          let localSampleCmdText = this.localUserCmdParams.join(" ");
          // 总命令
          this.cmdText =
            "global: " +
            globalSampleCmdText +
            "\n\n" +
            "local: " +
            localSampleCmdText;

          console.log("print sample cmd: ", this.cmdText);
        } else {
          // 未上传图片提示
          this.$Modal.info({
            title: "",
            content: "Please upload an image first !",
          });
        }
      }

      // //检查landmarks是否为空
      // if (this.localShowStatus && !this.firstDataSelectionValue) {
      //   // landmarks为空
      //   this.$Modal.info({
      //     title: "",
      //     content: "landmarks density is empty !",
      //     okText: "Ok",
      //   });
      //   return;
      // }
    },
    // 执行 cmd
    clickRunCmd() {
      // 记录当前点击的是哪一个按钮
      this.runClickStatus = true; // 说明点击了 run command,  下载时在 downloadSample 和 clikcRunCmd 中选择 ClickRunCmd;
      let that = this;

      if (this.regInfo.userEmail) {
        // 显示日志进度条
        this.showLogStatus = true;

        //点击run后，注册过邮箱则按钮变成绿色
        this.runStyle = this.runStyleValue;

        // 点击过状态更改, 点击过run command ，变为true
        this.runClickStatus = true;
        //log status
        this.logStatus = true;

        // result 进度条关闭
        this.showResultProgressStatus = false;

        //download 按钮颜色变成灰色
        this.downloadResStyle = "background-color:grey;opacity:0.6";

        //清空日志
        this.logText = "";

        // 当前时间
        if (!this.currentFileTime) {
          let currentTime = this.$moment(new Date()).format("YYYYMMDDHHmm");
          this.currentFileTime = currentTime;
        }

        //拼接参数并发送请求
        if (this.firstDataSelectionValue == "sample data") {
          //选项为 sample data 时,
          // global sample
          this.currentOPath =
            this.globalOSample[this.sampleDataOptionValue] +
            this.currentFileTime +
            "/";

          //获取当前文件夹名
          let currentFolderName =
            this.globalOSample[this.sampleDataOptionValue]
              .split("/")
              .slice(-1)[0] + this.currentFileTime;
          // 当前文件夹命名给全局变量
          this.currentFolderNameGlobal = currentFolderName;
          console.log("sample currentFolderName: ", currentFolderName);

          // // 拼接 global sample 参数
          this.globalCmdParams = [
            this.globalExeFix,
            this.globalFFix,
            this.globalCFix,
            this.globalMFixSample[this.sampleDataOptionValue],
            this.globalP,
            this.currentOPath,
            this.globalTh,
          ];

          // 拼接local sample
          if (this.yesOrNotValue == "yes") {
            this.localSampleCmdParams = [
              this.localExeFix,
              this.localPSample.define,
              this.localSSample[this.sampleDataOptionValue] +
                this.currentFileTime +
                "/global.v3draw",
              this.localMSample[this.sampleDataOptionValue],
              this.localLFix[this.landmarksDensityChange],
              this.localGFix,
              this.localOSample[this.sampleDataOptionValue] +
                this.currentFileTime +
                "/",
            ];
          } else {
            this.localSampleCmdParams = [];
          }

          // global sample
          let globalSampleCmdText = this.globalCmdParams.join(" ");

          //local sample
          let localSampleCmdText = this.localSampleCmdParams.join(" ");

          // 组合传递参数
          let cmdInfo = {};

          // global sample
          cmdInfo["globalRegistrationCmdParams"] = globalSampleCmdText;

          // local sample
          cmdInfo["localRegistrationCmdParams"] = localSampleCmdText;
          console.log("run cmd, global, local:", cmdInfo);

          // out path
          cmdInfo["out_path"] = this.currentOPath;

          //currentFolderName
          cmdInfo["currentFolderName"] = currentFolderName;

          // 请求
          // api.runCmd(cmdInfo).then((res) => {
          //   console.log("sample run cmd, res", res);
          // });

          this.$http
            .get("http://101.76.160.87/api/run_cmd", {
              params: {
                out_path: this.currentOPath,
                currentFolderName: currentFolderName,
                localRegistrationCmdParams: localSampleCmdText,
                globalRegistrationCmdParams: globalSampleCmdText,
              },
              _timeout: 60 * 60 * 10000, //超时时间 10h
              onTimeout: (request) => {
                alert("请求超时");
              },
            })
            .then((res) => {
              console.log("run cmd sample backend res: ", res);
              console.log("res data:", res.data);
              let resData = res.data;
              let mailStatus = resData.mail_status;
              console.log("sample mail_status: ", mailStatus);
              // console.log("resData.global:", resData.global);
              // console.log("resData.local:", resData.local);
              // console.log('resData.global == "true"', resData.global == "true");
              // console.log('resData.global == "no local"',resData.global == "no local");
              if (mailStatus == "true") {
                console.log("click run cmd http res: ", resData);
                //取消日志进度条
                this.showLogStatus = false;
                //run 按钮恢复点击前状态
                this.downloadSampleStyle = "";

                // 清空当前文件夹名
                this.currentFolderNameGlobal = "";

                //提示对话框邮件发送完成
                that.$Modal.success({
                  title: "Registration completed",
                  content: `Registration results have been sent to your email. Please check !<p><a>${this.regInfo.userEmail}</a></p>`,
                  okText: "Ok",
                  onOk: () => {
                    that.runStyle = ""; //run command 按钮恢复默认颜色；
                  },
                });
              } else {
                console.log("sample mail status false");
                //提示对话框:进程中断，不发送邮件
                that.$Modal.info({
                  title: "Registration interrupted",
                  content:
                    "Registration progress has been interrupted by other progress.A new progress is running.",
                  okText: "Ok",
                  // onOk: () => {
                  //   that.runStyle = ""; //run command 按钮恢复默认颜色；
                  // },
                });
              }
            },(err) =>{
                console.log("sample_data -- this.$http, err: ", err);
                console.log("正在调用 sample_data -- checkDownloadStatus")
                that.checkDownloadStatus();
              }
            );

          console.log("run cmd,sample, cmdInfo", cmdInfo);
          //启动log
          // this.logClick();
        } else if (this.firstDataSelectionValue == "user upload data") {
          if (this.uploadedFileList.length != 0) {
            // 选项为 user upload data
            this.currentOPath = this.globalOUser + this.currentFileTime + "/"; // 最终输出路径

            // 获取当前文件夹名
            let currentFolderName =
              this.globalOUser.split("/").slice(-1)[0] + this.currentFileTime;

            // 当前文件夹命名给全局变量
            this.currentFolderNameGlobal = currentFolderName;

            // global user
            this.globalUserCmdParams = [
              this.globalExeFix,
              this.globalFFix,
              this.globalCFix,
              this.globalMFixUser,
              this.globalP,
              this.currentOPath,
              this.globalTh,
            ];
            if (this.yesOrNotValue == "yes") {
              this.localSUser = `${this.localSUserVariable}/${this.currentUploadImg}${this.currentFileTime}/global.v3draw`;

              //local user
              this.localUserCmdParams = [
                this.localExeFix,
                this.localPUser,
                this.localSUser,
                this.localLFix[this.landmarksDensityChange],
                this.localGFix,
                this.currentOPath, // 此处local 与 global o 一致
              ];
            } else {
              this.localUserCmdParams = [];
            }
            // 列表中字符串拼接成一条命令,// global user
            let globalSampleCmdText = this.globalUserCmdParams.join(" ");
            //local sample
            let localSampleCmdText = this.localUserCmdParams.join(" ");
            // 组合传递参数
            let cmdInfo = {};
            // global sample
            cmdInfo["globalRegistrationCmdParams"] = globalSampleCmdText;

            // local sample
            cmdInfo["localRegistrationCmdParams"] = localSampleCmdText;
            console.log("run cmd, global, local:", cmdInfo);

            // out path
            cmdInfo["out_path"] = this.currentOPath;

            //currentFolderName
            cmdInfo["currentFolderName"] = currentFolderName;

            // user 请求
            console.log("run cmd,user upload data, cmdInfo", cmdInfo);

            this.$http
              .get("http://101.76.160.87/api/run_cmd", {
                params: {
                  out_path: this.currentOPath,
                  currentFolderName: currentFolderName,
                  localRegistrationCmdParams: localSampleCmdText,
                  globalRegistrationCmdParams: globalSampleCmdText,
                },
                _timeout: 60 * 60 * 10000,
                onTimeout: (request) => {
                  alert("请求超时");
                },
              })
              .then((res) => {
                console.log("run cmd -- user upload data backend res: ", res);
                // console.log("user upload data -- res data:", res.data);
                let resData = res.data;
                let mailStatus = resData.mail_status;
                console.log("user upload data mail_status: ", mailStatus);
                // console.log("resData.global:", resData.global);
                // console.log("resData.local:", resData.local);
                // console.log('resData.global == "true"', resData.global == "true");
                // console.log('resData.global == "no local"',resData.global == "no local");
                if (mailStatus == "true") {
                  console.log("click run cmd -- user upload data http res: ", resData);
                  //取消日志进度条
                  this.showLogStatus = false;
                  //run 按钮恢复点击前状态
                  this.downloadSampleStyle = "";

                  // 清空当前文件夹名
                  this.currentFolderNameGlobal = "";

                  //提示对话框邮件发送完成
                  that.$Modal.success({
                    title: "Registration completed",
                    content: `Registration results have been sent to your email. Please check !<p><a>${this.regInfo.userEmail}</a></p>`,
                    okText: "Ok",
                    onOk: () => {
                      that.runStyle = ""; //run command 按钮恢复默认颜色；
                    },
                  });
                } else {
                  console.log("user upload data -- mail status false");
                  //提示对话框:进程中断，不发送邮件
                  that.$Modal.info({
                    title: "Registration interrupted",
                    content:
                      "Registration progress has been interrupted by other progress.A new progress is running.",
                    okText: "Ok",
                    // onOk: () => {
                    //   that.runStyle = ""; //run command 按钮恢复默认颜色；
                    // },
                  });
                }
              },(err) =>{
                console.log("user upload data -- this.$http, err: ", err);
                console.log("正在调用user upload data -- checkDownloadStatus")
                that.checkDownloadStatus();
              }
              );
            // api.runCmd(cmdInfo).then((res) => {
            //   console.log("sample run cmd, res", res);
            // });

            //启动log
            // this.logClick();
          } else {
            // 未上传图片提示
            this.$Modal.info({
              title: "",
              content: "Please upload an image first !",
            });
          }
        }
      } else {
        //没有注册过邮箱

        //点击run后，注册过邮箱则按钮不改变颜色
        this.runStyle = "";

        // 1. 显示注册邮箱对话框
        this.regModalStatus = true;
        //2. 对话框title
        this.modalMailTitle = "Add email address";
      }
    },
    downloadFinal() {
      // console.log("download path: ", downloadPath);
      let pathDict = {};
      // let that = this;

      if (this.firstDataSelectionValue == "sample data") {
        pathDict["path"] = this.currentOPath; //路径参数
        console.log("download, pathdict:", pathDict);

        // console.log("download userSampleResultPath:", userSampleResultPath);

        api.downloadRes(pathDict).then((res) => {
          let data = res.data; // 这里后端对文件流做了一层封装，将data指向res.data即可
          if (!data) {
            // console.log("!data");
            return;
          }
          console.log("download res:", res);

          // let data = res.data;
          //下载
          //二进制， 进行下载
          let url = window.URL.createObjectURL(new Blob([data]));
          let a = document.createElement("a");
          a.style.display = "none";
          a.href = url;
          a.setAttribute("download", `result_${this.currentFileTime}.zip`);
          document.body.appendChild(a);
          a.click(); //执行下载
          window.URL.revokeObjectURL(a.href); //释放url
          document.body.removeChild(a); //释放标签
        });
      } else {
        //download user upload data
      }
    },
    //downloadResult
    downloadResult() {
      let that = this;
      // if (this.uploadedFileList.length != 0) {
      // 首先要上传图片再执行后面的逻辑
      if (this.runClickStatus) {
        //要求已经点击run command
        if (this.downloadResStyle == this.downloadStatusOk) {
          // 置空不显示进度条状态
          that.showResultProgressStatus = true;
        }

        let pathDict = {};
        pathDict["path"] = this.currentOPath; //路径参数

        api
          .downloadRes(pathDict)
          .then((res) => {
            let data = res.data; // 这里后端对文件流做了一层封装，将data指向res.data即可
            if (!data) {
              // console.log("!data");
              return;
            }
            let reader = new FileReader();
            reader.readAsText(data, "utf-8");
            reader.onload = function () {
              try {
                // json
                let resData = JSON.parse(this.result);
                console.log("is json,resData", resData);
                if (
                  !(resData.global == "true" && resData.local == "no local")
                ) {
                  // console.log("333333");
                  // modalFunc();
                  that.$Modal.info({
                    title: "",
                    title: "",
                    content: "Command Execution is Not Finished !",
                    okText: "Ok",
                  });
                } else {
                  alert(222);
                }
              } catch (err) {
                // 二进制文件
                // that.$Message.info({
                //   title: "",
                //   content: "File is downloading !",
                // });
                //置空
                that.resultFileSize = "";
                // 再次请求前获取总文件大小
                let fileSize = data.size;
                that.resultFileSize = fileSize;
                //再次请求
                axios({
                  url: "/download_result",
                  method: "POST",
                  responseType: "blob",
                  data: pathDict,
                  headers: {
                    Accept: "application/vnd.openxmlformats-officedocument",
                  },
                  onDownloadProgress: (progress) => {
                    that.showResultProgressStatus = true;
                    //已下载
                    let loadedSize = progress.loaded;
                    //已下载百分比
                    let downloadPercent = Math.floor(
                      (loadedSize / that.resultFileSize) * 100
                    );
                    that.resultDownloadPercent = downloadPercent;
                    //percent 为100 时， 关闭进度条
                    if (that.resultDownloadPercent == 100) {
                      setTimeout(function () {
                        that.showResultProgressStatus = false;
                      }, 1600);
                    }
                    console.log(
                      "that.resultDownloadPercent",
                      that.resultDownloadPercent
                    );
                    console.log("loadedSize: ", loadedSize);
                    console.log("that.resultFileSize", that.resultFileSize);
                  },
                }).then((res) => {
                  let data = res.data;
                  //下载
                  //二进制， 进行下载
                  let url = window.URL.createObjectURL(new Blob([data]));
                  let a = document.createElement("a");
                  a.style.display = "none";
                  a.href = url;
                  a.setAttribute("download", `result.zip`);
                  document.body.appendChild(a);
                  a.click(); //执行下载
                  window.URL.revokeObjectURL(a.href); //释放url
                  document.body.removeChild(a); //释放标签
                });
              }
            };
          })
          .catch((error) => {
            console.log(error);
          });
      } else {
        this.$Modal.info({
          title: "",
          content: "Click Run Command First !",
        });
      }
      // } else {
      //   // 未上传图片提示
      //   this.$Modal.info({
      //     title: "",
      //     content: "Please upload an image first !",
      //   });
      // }
      // },
    },
    checkDownloadStatus() {
      // console.log(11);
      //检查是否可以下载了
      let that = this;
      let timer = setInterval(function () {
        api
          .downloadStatus()
          .then((res) => {
            let data = res.data;
            console.log("checkDownloadStatus, data", data);
            // console.log(
            //   "download test, this.downloadResStyle",
            //   that.downloadResStyle
            // );
            if (data.ready_status == "true") {
              //提示对话框邮件发送完成
                that.$Modal.success({
                  title: "Registration completed",
                  content: `Registration results have been sent to your email. Please check !<p><a>${that.regInfo.userEmail}</a></p>`,
                  okText: "Ok",
                  onOk: () => {
                    that.runStyle = ""; //run command 按钮恢复默认颜色；
                  },
                });
              // // that.downloadResStyle = "opacity:1";
              // that.$Modal.success({
              //   title: "Registration completed",
              //   content: `Registration results have been sent to your email. Please check !<p><a>${this.regInfo.userEmail}</a></p>`,
              //   okText: "Ok",
              //   onOk: () => {
              //     //download sample 按钮恢复默认值
              //     this.downloadSampleStyle = "";
              //   },
              // });
              clearInterval(timer);
              return;
            }
          })
          .catch((err) => {
            console.log("checkDownloadStatus:", err);
          });
      }, 5000);
    },
  },
};
</script>

<style lang="less" scoped>
.all {
  display: flex;
  flex-flow: column;
}
.top {
  // display: flex;
  width: 100%;
  height: 48px;
  // background: pink;
  display: flex;
  margin-top: 80px;
  // top wrapper
  .top-wrapper {
    // background: purple;
    display: flex;
    flex: 1;
    margin: 0 50px;
    .top-left {
      // background: red;
      display: flex;
      flex: 1;
    }
    //注册按钮
    .register-mail {
      flex: none;
      line-height: 48px;
      // margin-right:0;
      .mail-btn {
      }
    }
  }
}

.bottom {
  width: 100%;
  // background: orange;
  display: flex;
  // justify-content: space-between; //两端对齐
}

// bottom right 右侧
.right {
  display: none;
  // display: flex;
  width: 300px;
  flex: none;
  flex-direction: column;
  margin-top: 10px;
  margin-left: 50px;
  // background: chocolate;
  //右上
  .right-top {
    width: 100%;
    height: 200px;
    // border: 2px solid red;
    //右上文本
    .right-top-text {
      text-align: center;
      line-height: 200px;
    }
  }
  // 右下
  .right-bottom {
    width: 100%;
    height: 100px;
    // border: 2px solid red;
    margin-top: 20px;
    //右下文本
    .right-bottom-text {
      text-align: center;
      line-height: 100px;
    }
  }
}
// bottom left 左侧
.left {
  // display: none;
  float: right;
  flex: 1;
  margin-top: 10px;
  margin-left: 50px;
  margin-right: 50px;
  // background: green;
  //整个参数和print区域， 要在这个区域内建立蒙版
  .paramsAndPrintArea {
    width: 100%;
    height: 100%;
    // border: 3px solid red;
    position: relative;
    .marker {
      //蒙版
      width: 100%;
      height: 100%;
      background: #f6f4f3;
      opacity: 0.6;
      position: absolute;
      z-index: 100;
    }
  }
}

// sample 选择区域
.sample-area,
.user-area {
  //1
  .sample-radio {
    text-align: center;
    // border: 1px solid red;
    margin-top: 10px;
    margin: 10px 20px 0px 20px;
  }
  //2
  .sample-direct,
  .user-direct {
    text-align: center;
    margin-top: 40px;
    .sample-download-btn,
    .sample-params-btn {
      margin-bottom: 20px;
    }
  }
}

// run btn 说明文字
.runText {
  margin-left: 30px;
  margin-top: 12px;
  font-size: 16px;
}

//参数区域
.params-area {
  margin-top: 10px;
  .illustration {
    margin-left: 60px;
  }
  .illustration-key {
    font-weight: bold;
  }
}
.label-wrapper {
  margin: 2px 0px 30px 0px;
}

.logBox {
  width: 1000px;
}
// .printBox,
// .logBox {
//   width: 800px;

// }
// textarea
.printBox.ivu-input-wrapper.ivu-input-wrapper-default.ivu-input-type-textarea,
.logBox.ivu-input-wrapper.ivu-input-wrapper-default.ivu-input-type-textarea {
  margin: 2px 0px;
}

// threshhold
.th.ivu-input-wrapper.ivu-input-wrapper-default.ivu-input-type-text {
  margin-left: 300px;
}
//进度条
.show-sample-progress {
  width: 400px;
  // width: 87%;
  margin: 0 auto;
}

.show-result-progress {
  width: 400px;
}
//边框样式
.border-common {
  border: 2px solid #dcdee2;
  padding: 2px;
  margin-bottom: 24px;
}
//log
.log-area {
  margin-top: 5px;
}

//1.input image
label.labelTitleStyle {
  background: #f2f1ce;
  font-weight: bold;
  font-size: 20px;
  width: 200px;
  height: 42px;
  text-align: left;
  display: inline-block;
  line-height: 42px;
  margin-left: -200px;
  margin-top: 8px;
  border-radius: 50px;
  padding-left: 16px;
}

//2. imageModalityLabel
label.imageModalityLabel,
label.paramsModalityLabel,
label.logModalityLabel {
  background: #f2f1ce;
  font-weight: bold;
  font-size: 20px;
  width: 200px;
  height: 42px;
  text-align: left;
  display: inline-block;
  line-height: 42px;
  // margin-left: -200px;
  margin-top: 8px;
  border-radius: 50px;
  padding-left: 16px;
}

&/deep/ .ivu-radio-wrapper {
  margin: 10px 50px;
}

// 改写下拉框
&/deep/ .ivu-select {
  display: inline-block;
  width: 400px;
  box-sizing: border-box;
  vertical-align: middle;
  color: #515a6e;
  font-size: 20px;
  line-height: normal;
}
//第二个框底部的文字说明样式
.secondBoxText {
  // background: red;
  height: 30px;
  line-height: 30px;
  margin-bottom: 20px;
  font-size: 16px;
  font-weight: bold;
  opacity: 0.8;
}

.log-progress {
  margin-top: 30px;
}

// log 进度条
&/deep/ .ivu-progress-outer {
  display: inline-block;
  width: 1000px;
  margin-right: 0;
  padding-right: 0;
}
//进度条动画
&/deep/ .ivu-progress-active .ivu-progress-bg:before {
  content: "";
  opacity: 1;
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: #ed4014;
  border-radius: 10px;
  animation: ivu-progress-active 2s ease-in-out infinite;
}

&/deep/.ivu-progress-bg {
  text-align: right;
  border-radius: 100px;
  background-color: #50a91f;
  transition: all 0.2s linear;
  position: relative;
}
&/deep/ .ivu-progress-inner {
  display: inline-block;
  width: 100%;
  background-color: #50a91f;
  border-radius: 100px;
  vertical-align: middle;
  position: relative;
}

//输入框靠左
&/deep/ .ivu-input-wrapper {
  // display: inline-block;
  // width: 100%;
  // position: relative;
  // vertical-align: middle;
  // line-height: normal;
  margin-left: 98px;
}
//modal primary
&/deep/ .ivu-modal-confirm-footer {
  margin-top: 20px;
  text-align: center;
}

// button primary
&/deep/ button.ivu-btn.ivu-btn-primary,
button.ivu-btn.ivu-btn-success {
  width: 230px;
  text-align: center;
  background: #f2f1ce;
  color: #21201c;
  border: 6px solid #f2f1ce;
  font-weight: bold;
  margin-right: 2px;
  border-radius: 20px;
  height: 48px;
}

&/deep/ button.mail-btn.ivu-btn.ivu-btn-default {
  height: 40px;
  width: 208px;
  text-align: center;
  line-height: 40px;
  font-size: 24px;
  font-weight: bold;
  color: blue;
}
&/deep/ .mail.ivu-input-wrapper.ivu-input-wrapper-default.ivu-input-type-text {
  margin-left: 0;
}
</style>