import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { BipyramidalPrism } from './models/BipyramidalPrism';
import { HexagonalBipyramid } from './models/HexagonalBipyramid';
import { DoublePrismComposite } from './models/DoublePrismComposite';
import { RhombicDodecaCube } from './models/RhombicDodecaCube'; 
import { BoxGeometryOne } from './models/BoxGeometryOne'; 
import { BoxGeometryTwo } from './models/BoxGeometryTwo'; 

export class CrystalViewer {
    constructor(container) {
        this.container = container;
        this.currentCrystal = null;
        this.axesHelper = null;
        this.clippingPlane = null;
        this.clippingPlaneHelper = null;
        // 简化对称面支持 - 统一为平面对称
        this.symmetryPlanes = [];
        this.symmetryPlanesVisible = false;
        // 添加对称轴投影支持
        this.symmetryAxes = [];
        this.symmetryAxesVisible = false;
        // 添加二次旋转对称轴支持
        this.binaryAxes = [];
        this.binaryAxesVisible = false;
        // 添加三次旋转对称轴支持
        this.ternaryAxes = [];
        this.ternaryAxesVisible = false;
        // 添加四次旋转对称轴支持
        this.quaternaryAxes = [];
        this.quaternaryAxesVisible = false;
        this.init();
        this.setupLights();
        this.animate();
    }

    init() {
        // 创建场景
        this.scene = new THREE.Scene();
        // 设置深蓝色背景
        this.scene.background = new THREE.Color(0x1a1a2e);
        
        // 创建相机
        this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        this.camera.position.set(6, 4, 6);

        // 创建渲染器
        this.renderer = new THREE.WebGLRenderer({ 
            antialias: true,
            alpha: true 
        });
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        // 启用阴影
        this.renderer.shadowMap.enabled = true;
        this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
        this.container.appendChild(this.renderer.domElement);

        // 创建控制器
        this.controls = new OrbitControls(this.camera, this.renderer.domElement);
        this.controls.enableDamping = true;
        this.controls.dampingFactor = 0.05;

        // 处理窗口调整
        window.addEventListener('resize', this.onWindowResize.bind(this));
    }

    setupLights() {
        // 增强环境光
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
        this.scene.add(ambientLight);

        // 主方向光
        const directionalLight = new THREE.DirectionalLight(0xffffff, 1.0);
        directionalLight.position.set(10, 10, 5);
        directionalLight.castShadow = true;
        directionalLight.shadow.mapSize.width = 2048;
        directionalLight.shadow.mapSize.height = 2048;
        this.scene.add(directionalLight);

        // 辅助方向光
        const directionalLight2 = new THREE.DirectionalLight(0xffffff, 0.6);
        directionalLight2.position.set(-5, -5, -5);
        this.scene.add(directionalLight2);

        // 添加点光源增强细节
        const pointLight = new THREE.PointLight(0xffffff, 0.8, 100);
        pointLight.position.set(5, 5, 5);
        this.scene.add(pointLight);
    }

    showCrystal(type) {
        // 移除当前晶体
        if (this.currentCrystal) {
            this.scene.remove(this.currentCrystal.getMesh());
        }

        // 创建新晶体
        switch(type) {
            case 'bipyramidal':
                this.currentCrystal = new RhombicDodecaCube();
                break;
            case 'hexagonal':
                this.currentCrystal = new HexagonalBipyramid();
                break;
            case 'doublePrism':
                this.currentCrystal = new DoublePrismComposite();
                break;
            case 'rhombicDodecaCube':
                this.currentCrystal = new BipyramidalPrism();
                break;
            case 'boxGeometry1':
                  this.currentCrystal = new BoxGeometryOne();
                  break;
            case 'boxGeometry2':
                  this.currentCrystal = new BoxGeometryTwo();
                  break;
        }

        if (this.currentCrystal) {
            // 只添加晶体，不默认显示坐标轴
            this.scene.add(this.currentCrystal.getMesh());
            
            // 如果切面是激活的，应用到新晶体
            if(this.clippingPlane){
                this.applyClippingToMesh(this.currentCrystal.getMesh());
            }

            // 如果对称面是显示状态，更新为新晶体的对称面
            if(this.symmetryPlanesVisible){
                this.showSymmetryPlanes();
            }

            // 如果对称轴是显示状态，更新为新晶体的对称轴
            if(this.symmetryAxesVisible){
                this.showSymmetryAxes();
            }

            // 如果二次旋转对称轴是显示状态，更新为新晶体的二次轴
            if(this.binaryAxesVisible){
                this.showBinaryAxes();
            }

            // 如果三次旋转对称轴是显示状态，更新为新晶体的三次轴
            if(this.ternaryAxesVisible){
                this.showTernaryAxes();
            }

            // 如果四次旋转对称轴是显示状态，更新为新晶体的四次轴
            if(this.quaternaryAxesVisible){
                this.showQuaternaryAxes();
            }
        }
    }

    showAxesHelper(){
        if(this.axesHelper){
            this.scene.remove(this.axesHelper);
        }
        
        this.axesHelper = this.initArrowHelper();
        
        if(this.axesHelper){
            this.scene.add(this.axesHelper);
        }
    }

    hideAxesHelper(){
        if(this.axesHelper){
            this.scene.remove(this.axesHelper);
            this.axesHelper = null;
        }
    }

    initArrowHelper(){
        const axisGroup = new THREE.Group();
        
        // 创建更明显的坐标轴
        const axisLength = 5;
        const axisWidth = 0.05;
        
        // X轴 - 红色
        const xGeometry = new THREE.CylinderGeometry(axisWidth, axisWidth, axisLength, 8);
        const xMaterial = new THREE.MeshPhongMaterial({ color: 0xff0000 });
        const xAxis = new THREE.Mesh(xGeometry, xMaterial);
        xAxis.rotation.z = -Math.PI / 2;
        xAxis.position.x = axisLength / 2;
        
        // X轴箭头
        const xArrowGeometry = new THREE.ConeGeometry(axisWidth * 3, axisWidth * 8, 8);
        const xArrow = new THREE.Mesh(xArrowGeometry, xMaterial);
        xArrow.rotation.z = -Math.PI / 2;
        xArrow.position.x = axisLength;
        
        // Y轴 - 绿色
        const yGeometry = new THREE.CylinderGeometry(axisWidth, axisWidth, axisLength, 8);
        const yMaterial = new THREE.MeshPhongMaterial({ color: 0x00ff00 });
        const yAxis = new THREE.Mesh(yGeometry, yMaterial);
        yAxis.position.y = axisLength / 2;
        
        // Y轴箭头
        const yArrowGeometry = new THREE.ConeGeometry(axisWidth * 3, axisWidth * 8, 8);
        const yArrow = new THREE.Mesh(yArrowGeometry, yMaterial);
        yArrow.position.y = axisLength;
        
        // Z轴 - 蓝色
        const zGeometry = new THREE.CylinderGeometry(axisWidth, axisWidth, axisLength, 8);
        const zMaterial = new THREE.MeshPhongMaterial({ color: 0x0000ff });
        const zAxis = new THREE.Mesh(zGeometry, zMaterial);
        zAxis.rotation.x = Math.PI / 2;
        zAxis.position.z = axisLength / 2;
        
        // Z轴箭头
        const zArrowGeometry = new THREE.ConeGeometry(axisWidth * 3, axisWidth * 8, 8);
        const zArrow = new THREE.Mesh(zArrowGeometry, zMaterial);
        zArrow.rotation.x = Math.PI / 2;
        zArrow.position.z = axisLength;
        
        axisGroup.add(xAxis, xArrow, yAxis, yArrow, zAxis, zArrow);
        return axisGroup;
    }

    animate() {
        requestAnimationFrame(this.animate.bind(this));
        this.controls.update();
        
        this.renderer.render(this.scene, this.camera);
    }

    onWindowResize() {
        this.camera.aspect = window.innerWidth / window.innerHeight;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(window.innerWidth, window.innerHeight);
    }

    showClippingPlane(){
        if(this.clippingPlaneHelper){
            this.scene.remove(this.clippingPlaneHelper);
        }
        
        // 创建切面平面 - 修改法向量方向
        this.clippingPlane = new THREE.Plane(new THREE.Vector3(-1, 0, 0), 0);
        
        // 创建切面平面的可视化辅助对象
        this.clippingPlaneHelper = this.createClippingPlaneHelper();
        
        // 应用切面到当前晶体
        if(this.currentCrystal){
            this.applyClippingToMesh(this.currentCrystal.getMesh());
        }
        
        if(this.clippingPlaneHelper){
            this.scene.add(this.clippingPlaneHelper);
        }
        
        // 更新渲染器的切面设置
        this.renderer.localClippingEnabled = true;
    }

    hideClippingPlane(){
        if(this.clippingPlaneHelper){
            this.scene.remove(this.clippingPlaneHelper);
            this.clippingPlaneHelper = null;
        }
        
        // 移除切面效果
        if(this.currentCrystal){
            this.removeClippingFromMesh(this.currentCrystal.getMesh());
        }
        
        this.clippingPlane = null;
        this.renderer.localClippingEnabled = false;
    }

    createClippingPlaneHelper(){
        const group = new THREE.Group();
        
        // 创建切面平面的可视化
        const planeGeometry = new THREE.PlaneGeometry(8, 8);
        const planeMaterial = new THREE.MeshPhongMaterial({
            color: 0xff6b6b,
            transparent: true,
            opacity: 0.3,
            side: THREE.DoubleSide,
            depthWrite: false
        });
        
        const planeMesh = new THREE.Mesh(planeGeometry, planeMaterial);
        planeMesh.rotation.y = Math.PI / 2; // 旋转90度使其垂直于X轴
        
        // 添加边框线条
        const edgesGeometry = new THREE.EdgesGeometry(planeGeometry);
        const edgesMaterial = new THREE.LineBasicMaterial({ 
            color: 0xff0000,
            linewidth: 3
        });
        const edges = new THREE.LineSegments(edgesGeometry, edgesMaterial);
        edges.rotation.y = Math.PI / 2;
        
        group.add(planeMesh);
        group.add(edges);
        
        return group;
    }

    applyClippingToMesh(mesh){
        if(!this.clippingPlane) return;
        
        mesh.traverse((child) => {
            if(child.isMesh && child.material){
                if(Array.isArray(child.material)){
                    child.material.forEach(mat => {
                        mat.clippingPlanes = [this.clippingPlane];
                        mat.needsUpdate = true;
                    });
                } else {
                    child.material.clippingPlanes = [this.clippingPlane];
                    child.material.needsUpdate = true;
                }
            }
        });
    }

    removeClippingFromMesh(mesh){
        mesh.traverse((child) => {
            if(child.isMesh && child.material){
                if(Array.isArray(child.material)){
                    child.material.forEach(mat => {
                        mat.clippingPlanes = [];
                        mat.needsUpdate = true;
                    });
                } else {
                    child.material.clippingPlanes = [];
                    child.material.needsUpdate = true;
                }
            }
        });
    }

    updateClippingPlane(position){
        if(this.clippingPlane){
            this.clippingPlane.constant = position;
            if(this.clippingPlaneHelper){
                this.clippingPlaneHelper.position.x = position;
            }
        }
    }

    // 显示对称面
    showSymmetryPlanes(){
        this.hideSymmetryPlanes(); // 先清理之前的对称面
        
        if(!this.currentCrystal) return;
        
        // 根据当前晶体类型创建对称面
        const crystalType = this.getCurrentCrystalType();
        this.createSymmetryPlanes(crystalType);
        
        this.symmetryPlanesVisible = true;
    }

    // 隐藏对称面
    hideSymmetryPlanes(){
        this.symmetryPlanes.forEach(plane => {
            this.scene.remove(plane);
        });
        this.symmetryPlanes = [];
        this.symmetryPlanesVisible = false;
    }

    // 显示对称轴投影
    showSymmetryAxes(){
        this.hideSymmetryAxes(); // 先清理之前的对称轴
        
        if(!this.currentCrystal) return;
        
        // 根据当前晶体类型创建对称轴
        const crystalType = this.getCurrentCrystalType();
        this.createSymmetryAxes(crystalType);
        
        this.symmetryAxesVisible = true;
    }

    // 隐藏对称轴投影
    hideSymmetryAxes(){
        this.symmetryAxes.forEach(axis => {
            this.scene.remove(axis);
        });
        this.symmetryAxes = [];
        this.symmetryAxesVisible = false;
    }

    // 显示二次旋转对称轴
    showBinaryAxes(){
        this.hideBinaryAxes(); // 先清理之前的二次轴
        
        if(!this.currentCrystal) return;
        
        // 根据当前晶体类型创建二次旋转对称轴
        const crystalType = this.getCurrentCrystalType();
        this.createBinaryAxes(crystalType);
        
        this.binaryAxesVisible = true;
    }

    // 隐藏二次旋转对称轴
    hideBinaryAxes(){
        this.binaryAxes.forEach(axis => {
            this.scene.remove(axis);
        });
        this.binaryAxes = [];
        this.binaryAxesVisible = false;
    }

    // 显示三次旋转对称轴
    showTernaryAxes(){
        this.hideTernaryAxes(); // 先清理之前的三次轴
        
        if(!this.currentCrystal) return false;
        
        // 根据当前晶体类型创建三次旋转对称轴
        const crystalType = this.getCurrentCrystalType();
        const ternaryAxesData = this.getTernaryAxesData(crystalType);
        
        // 检查是否有三次轴
        if(ternaryAxesData.length === 0) {
            // 没有三次轴，返回false表示无法显示
            return false;
        }
        
        this.createTernaryAxes(crystalType);
        this.ternaryAxesVisible = true;
        return true;
    }

    // 隐藏三次旋转对称轴
    hideTernaryAxes(){
        this.ternaryAxes.forEach(axis => {
            this.scene.remove(axis);
        });
        this.ternaryAxes = [];
        this.ternaryAxesVisible = false;
    }

    // 显示四次旋转对称轴
    showQuaternaryAxes(){
        this.hideQuaternaryAxes(); // 先清理之前的四次轴
        
        if(!this.currentCrystal) return false;
        
        // 根据当前晶体类型创建四次旋转对称轴
        const crystalType = this.getCurrentCrystalType();
        const quaternaryAxesData = this.getQuaternaryAxesData(crystalType);
        
        // 检查是否有四次轴
        if(quaternaryAxesData.length === 0) {
            // 没有四次轴，返回false表示无法显示
            return false;
        }
        
        this.createQuaternaryAxes(crystalType);
        this.quaternaryAxesVisible = true;
        return true;
    }

    // 隐藏四次旋转对称轴
    hideQuaternaryAxes(){
        this.quaternaryAxes.forEach(axis => {
            this.scene.remove(axis);
        });
        this.quaternaryAxes = [];
        this.quaternaryAxesVisible = false;
    }

    // 获取当前晶体类型
    getCurrentCrystalType(){
        if(!this.currentCrystal) return 'cubic';
        
        // 根据晶体构造函数名称判断类型
        const constructorName = this.currentCrystal.constructor.name;
        switch(constructorName) {
            case 'RhombicDodecaCube':
                return 'cubic'; // 立方晶系
            case 'HexagonalBipyramid':
                return 'hexagonal'; // 六方晶系
            case 'BipyramidalPrism':
                return 'tetragonal'; // 四方晶系
            case 'BoxGeometryTwo':
                return 'orthorhombic'; // 斜方晶系
            default:
                return 'cubic';
        }
    }

    // 创建对称面
    createSymmetryPlanes(crystalType){
        const symmetryData = this.getSymmetryData(crystalType);
        
        symmetryData.forEach((data, index) => {
            const plane = this.createSymmetryPlane(data.normal, data.color, index);
            this.symmetryPlanes.push(plane);
            this.scene.add(plane);
        });
    }

    // 获取不同晶系的对称面数据
    getSymmetryData(crystalType){
        switch(crystalType) {
            case 'cubic': // 立方晶系 - 主要平面对称
                return [
                    // 主要坐标面
                    { normal: [1, 0, 0], color: 0xff6b6b }, // YZ面
                    { normal: [0, 1, 0], color: 0x6bff6b }, // XZ面
                    { normal: [0, 0, 1], color: 0x6b6bff }, // XY面
                    // 主要对角面
                    { normal: [1, 1, 0], color: 0xffff6b }, // 对角面1
                    { normal: [1, -1, 0], color: 0xff6bff }, // 对角面2
                    { normal: [1, 0, 1], color: 0x6bffff }, // 对角面3
                    { normal: [1, 0, -1], color: 0xffa500 }, // 对角面4
                    { normal: [0, 1, 1], color: 0x9370db }, // 对角面5
                    { normal: [0, 1, -1], color: 0x20b2aa }  // 对角面6
                ];
            
            case 'hexagonal': // 六方晶系 - 主要平面对称
                return [
                    // 主要坐标面
                    { normal: [1, 0, 0], color: 0xff6b6b }, // YZ面
                    { normal: [0, 1, 0], color: 0x6bff6b }, // XZ面
                    { normal: [0, 0, 1], color: 0x6b6bff }, // XY面
                    // 六方对称面 - 竖直对称面（Y轴方向）
                    { normal: [0.866, 0, 0.5], color: 0xffff6b }, // 30度竖直对称面
                    { normal: [0.5, 0, 0.866], color: 0xff6bff }, // 60度竖直对称面
                    { normal: [-0.5, 0, 0.866], color: 0x6bffff }, // 120度竖直对称面
                    { normal: [-0.866, 0, 0.5], color: 0xffa500 }, // 150度竖直对称面
                    { normal: [-0.866, 0, -0.5], color: 0x9370db }, // 210度竖直对称面
                    { normal: [-0.5, 0, -0.866], color: 0x20b2aa }, // 240度竖直对称面
                    { normal: [0.5, 0, -0.866], color: 0xffc0cb }, // 300度竖直对称面
                    { normal: [0.866, 0, -0.5], color: 0x98fb98 }  // 330度竖直对称面
                ];
            
            case 'tetragonal': // 四方晶系 - 主要平面对称
                return [
                    // 主要坐标面
                    { normal: [1, 0, 0], color: 0xff6b6b }, // YZ面
                    { normal: [0, 1, 0], color: 0x6bff6b }, // XZ面
                    { normal: [0, 0, 1], color: 0x6b6bff }, // XY面
                    // 四方对称面 - 竖直对称面（Y轴方向）
                    { normal: [1, 0, 1], color: 0xffff6b }, // 45度竖直对称面
                    { normal: [1, 0, -1], color: 0xff6bff }, // 135度竖直对称面
                    { normal: [-1, 0, 1], color: 0x6bffff }, // 225度竖直对称面
                    { normal: [-1, 0, -1], color: 0xffa500 }  // 315度竖直对称面
                ];
            
            case 'orthorhombic': // 斜方晶系 - 主要平面对称
                return [
                    // 主要坐标面
                    { normal: [1, 0, 0], color: 0xff6b6b }, // YZ面
                    { normal: [0, 1, 0], color: 0x6bff6b }, // XZ面
                    { normal: [0, 0, 1], color: 0x6b6bff }  // XY面
                ];
            
            default:
                return [
                    { normal: [1, 0, 0], color: 0xff6b6b },
                    { normal: [0, 1, 0], color: 0x6bff6b },
                    { normal: [0, 0, 1], color: 0x6b6bff }
                ];
        }
    }

    // 创建单个对称面
    createSymmetryPlane(normal, color, index){
        const group = new THREE.Group();
        
        // 创建对称面平面
        const planeGeometry = new THREE.PlaneGeometry(8, 8);
        const planeMaterial = new THREE.MeshPhongMaterial({
            color: color,
            transparent: true,
            opacity: 0.15,
            side: THREE.DoubleSide,
            depthWrite: false
        });
        
        const planeMesh = new THREE.Mesh(planeGeometry, planeMaterial);
        
        // 计算平面的旋转
        const normalVector = new THREE.Vector3(normal[0], normal[1], normal[2]).normalize();
        const defaultNormal = new THREE.Vector3(0, 0, 1);
        
        if (!normalVector.equals(defaultNormal)) {
            const quaternion = new THREE.Quaternion().setFromUnitVectors(defaultNormal, normalVector);
            planeMesh.setRotationFromQuaternion(quaternion);
        }
        
        // 添加边框线条
        const edgesGeometry = new THREE.EdgesGeometry(planeGeometry);
        const edgesMaterial = new THREE.LineBasicMaterial({ 
            color: color,
            linewidth: 2,
            transparent: true,
            opacity: 0.8
        });
        const edges = new THREE.LineSegments(edgesGeometry, edgesMaterial);
        edges.rotation.copy(planeMesh.rotation);
        
        group.add(planeMesh);
        group.add(edges);
        
        return group;
    }

    // 创建对称轴投影
    createSymmetryAxes(crystalType){
        const axesData = this.getSymmetryAxesData(crystalType);
        
        axesData.forEach((data, index) => {
            const axis = this.createSymmetryAxis(data.direction, data.order, data.color, index);
            this.symmetryAxes.push(axis);
            this.scene.add(axis);
        });
    }

    // 获取不同晶系的对称轴数据
    getSymmetryAxesData(crystalType){
        switch(crystalType) {
            case 'cubic': // 立方晶系
                return [
                    // 4次轴 - 沿坐标轴
                    { direction: [0, 1, 0], order: 4, color: 0xff0000 }, // Y轴4次轴
                    { direction: [1, 0, 0], order: 4, color: 0xff0000 }, // X轴4次轴
                    { direction: [0, 0, 1], order: 4, color: 0xff0000 }, // Z轴4次轴
                    // 3次轴 - 沿体对角线
                    { direction: [1, 1, 1], order: 3, color: 0x00ff00 }, // 体对角线3次轴1
                    { direction: [1, 1, -1], order: 3, color: 0x00ff00 }, // 体对角线3次轴2
                    { direction: [1, -1, 1], order: 3, color: 0x00ff00 }, // 体对角线3次轴3
                    { direction: [-1, 1, 1], order: 3, color: 0x00ff00 }, // 体对角线3次轴4
                    // 2次轴 - 沿面对角线
                    { direction: [1, 1, 0], order: 2, color: 0x0000ff }, // 面对角线2次轴1
                    { direction: [1, -1, 0], order: 2, color: 0x0000ff }, // 面对角线2次轴2
                    { direction: [1, 0, 1], order: 2, color: 0x0000ff }, // 面对角线2次轴3
                    { direction: [1, 0, -1], order: 2, color: 0x0000ff }, // 面对角线2次轴4
                    { direction: [0, 1, 1], order: 2, color: 0x0000ff }, // 面对角线2次轴5
                    { direction: [0, 1, -1], order: 2, color: 0x0000ff }  // 面对角线2次轴6
                ];
            
            case 'hexagonal': // 六方晶系
                return [
                    // 6次轴 - 沿c轴
                    { direction: [0, 1, 0], order: 6, color: 0xff0000 }, // 主6次轴
                    // 2次轴 - 垂直于c轴
                    { direction: [1, 0, 0], order: 2, color: 0x0000ff }, // 2次轴1
                    { direction: [0.866, 0, 0.5], order: 2, color: 0x0000ff }, // 2次轴2
                    { direction: [0.5, 0, 0.866], order: 2, color: 0x0000ff }, // 2次轴3
                    { direction: [-0.5, 0, 0.866], order: 2, color: 0x0000ff }, // 2次轴4
                    { direction: [-0.866, 0, 0.5], order: 2, color: 0x0000ff }, // 2次轴5
                    { direction: [-0.866, 0, -0.5], order: 2, color: 0x0000ff }  // 2次轴6
                ];
            
            case 'tetragonal': // 四方晶系
                return [
                    // 4次轴 - 沿c轴
                    { direction: [0, 1, 0], order: 4, color: 0xff0000 }, // 主4次轴
                    // 2次轴 - 垂直于c轴
                    { direction: [1, 0, 0], order: 2, color: 0x0000ff }, // 2次轴1
                    { direction: [0, 0, 1], order: 2, color: 0x0000ff }, // 2次轴2
                    { direction: [1, 0, 1], order: 2, color: 0x0000ff }, // 对角2次轴1
                    { direction: [1, 0, -1], order: 2, color: 0x0000ff }  // 对角2次轴2
                ];
            
            case 'orthorhombic': // 斜方晶系
                return [
                    // 2次轴 - 沿三个坐标轴
                    { direction: [1, 0, 0], order: 2, color: 0x0000ff }, // X轴2次轴
                    { direction: [0, 1, 0], order: 2, color: 0x0000ff }, // Y轴2次轴
                    { direction: [0, 0, 1], order: 2, color: 0x0000ff }  // Z轴2次轴
                ];
            
            default:
                return [
                    { direction: [0, 1, 0], order: 1, color: 0x888888 }
                ];
        }
    }

    // 创建单个对称轴
    createSymmetryAxis(direction, order, color, index){
        const group = new THREE.Group();
        
        // 标准化方向向量
        const dir = new THREE.Vector3(direction[0], direction[1], direction[2]).normalize();
        
        // 创建轴线 - 使用更长的圆柱体穿过晶体
        const axisLength = 12; // 增加长度以穿过晶体
        const axisRadius = order === 6 ? 0.08 : order === 4 ? 0.06 : order === 3 ? 0.05 : 0.04;
        
        const axisGeometry = new THREE.CylinderGeometry(axisRadius, axisRadius, axisLength, 8);
        const axisMaterial = new THREE.MeshPhongMaterial({ 
            color: color,
            transparent: true,
            opacity: 0.6 // 降低透明度以便看到穿过效果
        });
        
        const axisMesh = new THREE.Mesh(axisGeometry, axisMaterial);
        
        // 计算旋转使轴线沿指定方向
        const defaultDirection = new THREE.Vector3(0, 1, 0);
        if (!dir.equals(defaultDirection)) {
            const quaternion = new THREE.Quaternion().setFromUnitVectors(defaultDirection, dir);
            axisMesh.setRotationFromQuaternion(quaternion);
        }
        
        // 创建轴端标记 - 根据对称次数创建不同形状
        const markerGeometry = new THREE.ConeGeometry(0.15, 0.3, 6);
        const markerMaterial = new THREE.MeshPhongMaterial({ 
            color: color,
            transparent: true,
            opacity: 0.9
        });
        
        // 正端标记 - 放在更远的位置
        const markerTop = new THREE.Mesh(markerGeometry, markerMaterial);
        markerTop.position.copy(dir.clone().multiplyScalar(axisLength / 2 + 0.3));
        if (!dir.equals(defaultDirection)) {
            const quaternion = new THREE.Quaternion().setFromUnitVectors(defaultDirection, dir);
            markerTop.setRotationFromQuaternion(quaternion);
        }
        
        // 负端标记 - 放在更远的位置
        const markerBottom = new THREE.Mesh(markerGeometry, markerMaterial);
        markerBottom.position.copy(dir.clone().multiplyScalar(-(axisLength / 2 + 0.3)));
        if (!dir.equals(defaultDirection)) {
            const quaternion = new THREE.Quaternion().setFromUnitVectors(defaultDirection, dir);
            markerBottom.setRotationFromQuaternion(quaternion);
        }
        
        // 添加对称次数标签（可选）
        if (order > 1) {
            const textGeometry = new THREE.RingGeometry(0.15, 0.25, 8);
            const textMaterial = new THREE.MeshPhongMaterial({ 
                color: color,
                transparent: true,
                opacity: 0.7
            });
            const textMesh = new THREE.Mesh(textGeometry, textMaterial);
            textMesh.position.copy(dir.clone().multiplyScalar(axisLength / 2 + 0.6));
            group.add(textMesh);
        }
        
        group.add(axisMesh);
        group.add(markerTop);
        group.add(markerBottom);
        
        // 添加穿过标记以增强视觉效果
        this.addAxisPenetrationMarkers(group, direction, color, axisLength);
        
        return group;
    }

    // 添加轴线穿过标记（可选的视觉增强）
    addAxisPenetrationMarkers(group, direction, color, axisLength) {
        const dir = new THREE.Vector3(direction[0], direction[1], direction[2]).normalize();
        
        // 在轴线上添加几个小的穿过标记
        const markerPositions = [-0.8, -0.4, 0, 0.4, 0.8]; // 相对于轴线长度的位置
        
        markerPositions.forEach(pos => {
            const markerGeometry = new THREE.SphereGeometry(0.05, 8, 6);
            const markerMaterial = new THREE.MeshPhongMaterial({ 
                color: color,
                transparent: true,
                opacity: 0.8,
                emissive: color,
                emissiveIntensity: 0.1
            });
            
            const marker = new THREE.Mesh(markerGeometry, markerMaterial);
            marker.position.copy(dir.clone().multiplyScalar(pos * axisLength / 2));
            group.add(marker);
        });
    }

    // 创建二次旋转对称轴
    createBinaryAxes(crystalType){
        const binaryAxesData = this.getBinaryAxesData(crystalType);
        
        binaryAxesData.forEach((data, index) => {
            const axis = this.createBinaryAxis(data.direction, data.color, index);
            this.binaryAxes.push(axis);
            this.scene.add(axis);
        });
    }

    // 获取不同晶系的二次旋转对称轴数据
    getBinaryAxesData(crystalType){
        switch(crystalType) {
            case 'cubic': // 立方晶系 - 只显示2次轴
                return [
                    // 2次轴 - 沿面对角线（立方体的边中点连线）
                    { direction: [1, 1, 0], color: 0x00ffff }, // XY面对角线2次轴1 - 青色
                    { direction: [1, -1, 0], color: 0x00ffff }, // XY面对角线2次轴2 - 青色
                    { direction: [1, 0, 1], color: 0x00ffff }, // XZ面对角线2次轴3 - 青色
                    { direction: [1, 0, -1], color: 0x00ffff }, // XZ面对角线2次轴4 - 青色
                    { direction: [0, 1, 1], color: 0x00ffff }, // YZ面对角线2次轴5 - 青色
                    { direction: [0, 1, -1], color: 0x00ffff }  // YZ面对角线2次轴6 - 青色
                ];
            
            case 'hexagonal': // 六方晶系 - 只显示2次轴
                return [
                    // 2次轴 - 垂直于主轴（c轴）的平面内
                    { direction: [1, 0, 0], color: 0x00ffff }, // 2次轴1 - 青色
                    { direction: [0.866, 0, 0.5], color: 0x00ffff }, // 2次轴2（30度） - 青色
                    { direction: [0.5, 0, 0.866], color: 0x00ffff }, // 2次轴3（60度） - 青色
                    { direction: [-0.5, 0, 0.866], color: 0x00ffff }, // 2次轴4（120度） - 青色
                    { direction: [-0.866, 0, 0.5], color: 0x00ffff }, // 2次轴5（150度） - 青色
                    { direction: [-0.866, 0, -0.5], color: 0x00ffff }, // 2次轴6（210度） - 青色
                    { direction: [-0.5, 0, -0.866], color: 0x00ffff }, // 2次轴7（240度） - 青色
                    { direction: [0.5, 0, -0.866], color: 0x00ffff }, // 2次轴8（300度） - 青色
                    { direction: [0.866, 0, -0.5], color: 0x00ffff }  // 2次轴9（330度） - 青色
                ];
            
            case 'tetragonal': // 四方晶系 - 只显示2次轴
                return [
                    // 2次轴 - 垂直于主轴（c轴）
                    { direction: [1, 0, 0], color: 0x00ffff }, // X轴2次轴 - 青色
                    { direction: [0, 0, 1], color: 0x00ffff }, // Z轴2次轴 - 青色
                    { direction: [1, 0, 1], color: 0x00ffff }, // 对角2次轴1（45度） - 青色
                    { direction: [1, 0, -1], color: 0x00ffff }  // 对角2次轴2（135度） - 青色
                ];
            
            case 'orthorhombic': // 斜方晶系 - 只显示2次轴
                return [
                    // 2次轴 - 沿三个坐标轴
                    { direction: [1, 0, 0], color: 0x00ffff }, // X轴2次轴 - 青色
                    { direction: [0, 1, 0], color: 0x00ffff }, // Y轴2次轴 - 青色
                    { direction: [0, 0, 1], color: 0x00ffff }  // Z轴2次轴 - 青色
                ];
            
            default:
                return [
                    { direction: [0, 1, 0], color: 0x00ffff }
                ];
        }
    }

    // 创建单个二次旋转对称轴
    createBinaryAxis(direction, color, index){
        const group = new THREE.Group();
        
        // 标准化方向向量
        const dir = new THREE.Vector3(direction[0], direction[1], direction[2]).normalize();
        
        // 创建轴线 - 使用更长的圆柱体穿过晶体
        const axisLength = 10; // 增加长度以穿过晶体
        const axisRadius = 0.03;
        
        const axisGeometry = new THREE.CylinderGeometry(axisRadius, axisRadius, axisLength, 8);
        const axisMaterial = new THREE.MeshPhongMaterial({ 
            color: color,
            transparent: true,
            opacity: 0.5 // 降低透明度以便看到穿过效果
        });
        
        const axisMesh = new THREE.Mesh(axisGeometry, axisMaterial);
        
        // 计算旋转使轴线沿指定方向
        const defaultDirection = new THREE.Vector3(0, 1, 0);
        if (!dir.equals(defaultDirection)) {
            const quaternion = new THREE.Quaternion().setFromUnitVectors(defaultDirection, dir);
            axisMesh.setRotationFromQuaternion(quaternion);
        }
        
        // 创建二次轴特有的椭圆形标记
        const markerGeometry = new THREE.SphereGeometry(0.08, 8, 6);
        markerGeometry.scale(1, 0.5, 1); // 压扁成椭圆形，表示2次对称
        
        const markerMaterial = new THREE.MeshPhongMaterial({ 
            color: color,
            transparent: true,
            opacity: 0.8
        });
        
        // 正端标记 - 放在更远的位置
        const markerTop = new THREE.Mesh(markerGeometry, markerMaterial);
        markerTop.position.copy(dir.clone().multiplyScalar(axisLength / 2 + 0.2));
        if (!dir.equals(defaultDirection)) {
            const quaternion = new THREE.Quaternion().setFromUnitVectors(defaultDirection, dir);
            markerTop.setRotationFromQuaternion(quaternion);
        }
        
        // 负端标记 - 放在更远的位置
        const markerBottom = new THREE.Mesh(markerGeometry, markerMaterial);
        markerBottom.position.copy(dir.clone().multiplyScalar(-(axisLength / 2 + 0.2)));
        if (!dir.equals(defaultDirection)) {
            const quaternion = new THREE.Quaternion().setFromUnitVectors(defaultDirection, dir);
            markerBottom.setRotationFromQuaternion(quaternion);
        }
        
        // 添加中间的2次对称标记
        const centerMarkerGeometry = new THREE.TorusGeometry(0.1, 0.02, 8, 16);
        const centerMarkerMaterial = new THREE.MeshPhongMaterial({ 
            color: color,
            transparent: true,
            opacity: 0.6
        });
        const centerMarker = new THREE.Mesh(centerMarkerGeometry, centerMarkerMaterial);
        
        // 使环形标记垂直于轴线
        if (!dir.equals(defaultDirection)) {
            const quaternion = new THREE.Quaternion().setFromUnitVectors(defaultDirection, dir);
            centerMarker.setRotationFromQuaternion(quaternion);
        }
        
        group.add(axisMesh);
        group.add(markerTop);
        group.add(markerBottom);
        group.add(centerMarker);
        
        // 添加穿过标记以增强视觉效果
        this.addAxisPenetrationMarkers(group, direction, color, axisLength);
        
        return group;
    }

    // 创建三次旋转对称轴
    createTernaryAxes(crystalType){
        const ternaryAxesData = this.getTernaryAxesData(crystalType);
        
        ternaryAxesData.forEach((data, index) => {
            const axis = this.createTernaryAxis(data.direction, data.color, index);
            this.ternaryAxes.push(axis);
            this.scene.add(axis);
        });
    }

    // 获取不同晶系的三次旋转对称轴数据
    getTernaryAxesData(crystalType){
        switch(crystalType) {
            case 'cubic': // 立方晶系 - 只有立方晶系有3次轴
                return [
                    // 3次轴 - 沿体对角线
                    { direction: [1, 1, 1], color: 0x00ff00 }, // 体对角线3次轴1
                    { direction: [1, 1, -1], color: 0x00ff00 }, // 体对角线3次轴2
                    { direction: [1, -1, 1], color: 0x00ff00 }, // 体对角线3次轴3
                    { direction: [-1, 1, 1], color: 0x00ff00 }  // 体对角线3次轴4
                ];
            
            case 'hexagonal': // 六方晶系 - 没有3次轴
                return [];
            
            case 'tetragonal': // 四方晶系 - 没有3次轴
                return [];
            
            case 'orthorhombic': // 斜方晶系 - 没有3次轴
                return [];
            
            default:
                return [];
        }
    }

    // 创建单个三次旋转对称轴
    createTernaryAxis(direction, color, index){
        const group = new THREE.Group();
        
        // 标准化方向向量
        const dir = new THREE.Vector3(direction[0], direction[1], direction[2]).normalize();
        
        // 创建轴线 - 使用更长的圆柱体穿过晶体
        const axisLength = 12; // 增加长度以穿过晶体
        const axisRadius = 0.05;
        
        const axisGeometry = new THREE.CylinderGeometry(axisRadius, axisRadius, axisLength, 8);
        const axisMaterial = new THREE.MeshPhongMaterial({ 
            color: color,
            transparent: true,
            opacity: 0.6 // 降低透明度以便看到穿过效果
        });
        
        const axisMesh = new THREE.Mesh(axisGeometry, axisMaterial);
        
        // 计算旋转使轴线沿指定方向
        const defaultDirection = new THREE.Vector3(0, 1, 0);
        if (!dir.equals(defaultDirection)) {
            const quaternion = new THREE.Quaternion().setFromUnitVectors(defaultDirection, dir);
            axisMesh.setRotationFromQuaternion(quaternion);
        }
        
        // 创建轴端标记 - 根据对称次数创建不同形状
        const markerGeometry = new THREE.ConeGeometry(0.15, 0.3, 6);
        const markerMaterial = new THREE.MeshPhongMaterial({ 
            color: color,
            transparent: true,
            opacity: 0.9
        });
        
        // 正端标记 - 放在更远的位置
        const markerTop = new THREE.Mesh(markerGeometry, markerMaterial);
        markerTop.position.copy(dir.clone().multiplyScalar(axisLength / 2 + 0.3));
        if (!dir.equals(defaultDirection)) {
            const quaternion = new THREE.Quaternion().setFromUnitVectors(defaultDirection, dir);
            markerTop.setRotationFromQuaternion(quaternion);
        }
        
        // 负端标记 - 放在更远的位置
        const markerBottom = new THREE.Mesh(markerGeometry, markerMaterial);
        markerBottom.position.copy(dir.clone().multiplyScalar(-(axisLength / 2 + 0.3)));
        if (!dir.equals(defaultDirection)) {
            const quaternion = new THREE.Quaternion().setFromUnitVectors(defaultDirection, dir);
            markerBottom.setRotationFromQuaternion(quaternion);
        }
        
        // 添加三次轴特有的三角形标记
        const triangleGeometry = new THREE.ConeGeometry(0.12, 0.25, 3);
        const triangleMaterial = new THREE.MeshPhongMaterial({ 
            color: color,
            transparent: true,
            opacity: 0.7
        });
        const triangleMarker = new THREE.Mesh(triangleGeometry, triangleMaterial);
        triangleMarker.position.copy(dir.clone().multiplyScalar(axisLength / 2 + 0.6));
        if (!dir.equals(defaultDirection)) {
            const quaternion = new THREE.Quaternion().setFromUnitVectors(defaultDirection, dir);
            triangleMarker.setRotationFromQuaternion(quaternion);
        }
        
        group.add(axisMesh);
        group.add(markerTop);
        group.add(markerBottom);
        group.add(triangleMarker);
        
        // 添加穿过标记以增强视觉效果
        this.addAxisPenetrationMarkers(group, direction, color, axisLength);
        
        return group;
    }

    // 创建四次旋转对称轴
    createQuaternaryAxes(crystalType){
        const quaternaryAxesData = this.getQuaternaryAxesData(crystalType);
        
        quaternaryAxesData.forEach((data, index) => {
            const axis = this.createQuaternaryAxis(data.direction, data.color, index);
            this.quaternaryAxes.push(axis);
            this.scene.add(axis);
        });
    }

    // 获取不同晶系的四次旋转对称轴数据
    getQuaternaryAxesData(crystalType){
        switch(crystalType) {
            case 'cubic': // 立方晶系 - 有四次轴
                return [
                    // 4次轴 - 沿坐标轴
                    { direction: [0, 1, 0], color: 0xff0000 }, // Y轴4次轴
                    { direction: [1, 0, 0], color: 0xff0000 }, // X轴4次轴
                    { direction: [0, 0, 1], color: 0xff0000 }  // Z轴4次轴
                ];
            
            case 'tetragonal': // 四方晶系 - 有四次轴
                return [
                    // 4次轴 - 沿c轴（主轴）
                    { direction: [0, 1, 0], color: 0xff0000 }  // 主4次轴
                ];
            
            case 'hexagonal': // 六方晶系 - 没有4次轴（有6次轴）
                return [];
            
            case 'orthorhombic': // 斜方晶系 - 没有4次轴
                return [];
            
            default:
                return [];
        }
    }

    // 创建单个四次旋转对称轴
    createQuaternaryAxis(direction, color, index){
        const group = new THREE.Group();
        
        // 标准化方向向量
        const dir = new THREE.Vector3(direction[0], direction[1], direction[2]).normalize();
        
        // 创建轴线 - 使用更长的圆柱体穿过晶体
        const axisLength = 12; // 增加长度以穿过晶体
        const axisRadius = 0.06; // 比三次轴稍粗一些
        
        const axisGeometry = new THREE.CylinderGeometry(axisRadius, axisRadius, axisLength, 8);
        const axisMaterial = new THREE.MeshPhongMaterial({ 
            color: color,
            transparent: true,
            opacity: 0.6 // 降低透明度以便看到穿过效果
        });
        
        const axisMesh = new THREE.Mesh(axisGeometry, axisMaterial);
        
        // 计算旋转使轴线沿指定方向
        const defaultDirection = new THREE.Vector3(0, 1, 0);
        if (!dir.equals(defaultDirection)) {
            const quaternion = new THREE.Quaternion().setFromUnitVectors(defaultDirection, dir);
            axisMesh.setRotationFromQuaternion(quaternion);
        }
        
        // 创建四次轴特有的正方形标记
        const markerGeometry = new THREE.BoxGeometry(0.2, 0.3, 0.2);
        const markerMaterial = new THREE.MeshPhongMaterial({ 
            color: color,
            transparent: true,
            opacity: 0.9
        });
        
        // 正端标记 - 放在更远的位置
        const markerTop = new THREE.Mesh(markerGeometry, markerMaterial);
        markerTop.position.copy(dir.clone().multiplyScalar(axisLength / 2 + 0.3));
        if (!dir.equals(defaultDirection)) {
            const quaternion = new THREE.Quaternion().setFromUnitVectors(defaultDirection, dir);
            markerTop.setRotationFromQuaternion(quaternion);
        }
        
        // 负端标记 - 放在更远的位置
        const markerBottom = new THREE.Mesh(markerGeometry, markerMaterial);
        markerBottom.position.copy(dir.clone().multiplyScalar(-(axisLength / 2 + 0.3)));
        if (!dir.equals(defaultDirection)) {
            const quaternion = new THREE.Quaternion().setFromUnitVectors(defaultDirection, dir);
            markerBottom.setRotationFromQuaternion(quaternion);
        }
        
        // 添加四次轴特有的正方形环标记
        const squareRingGeometry = new THREE.TorusGeometry(0.12, 0.03, 4, 4);
        const squareRingMaterial = new THREE.MeshPhongMaterial({ 
            color: color,
            transparent: true,
            opacity: 0.7
        });
        const squareRingMarker = new THREE.Mesh(squareRingGeometry, squareRingMaterial);
        
        // 使环形标记垂直于轴线
        if (!dir.equals(defaultDirection)) {
            const quaternion = new THREE.Quaternion().setFromUnitVectors(defaultDirection, dir);
            squareRingMarker.setRotationFromQuaternion(quaternion);
        }
        
        group.add(axisMesh);
        group.add(markerTop);
        group.add(markerBottom);
        group.add(squareRingMarker);
        
        // 添加穿过标记以增强视觉效果
        this.addAxisPenetrationMarkers(group, direction, color, axisLength);
        
        return group;
    }
}
