import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

class CrystalViewer {
    constructor(container) {
        // 初始化场景
        this.scene = new THREE.Scene();
        this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        this.renderer = new THREE.WebGLRenderer({ antialias: true });
        
        // 设置渲染器
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        container.appendChild(this.renderer.domElement);
        
        // 添加控制器
        this.controls = new OrbitControls(this.camera, this.renderer.domElement);
        
        // 初始化模型数组
        this.models = [];
        this.currentModelIndex = 0;
        
        // 初始化控制按钮
        this.initializeControls();
        
        // 设置相机位置
        this.camera.position.z = 5;
        
        // 开始动画循环
        this.animate();
    }
    
    initializeControls() {
        const controls = [
            '坐标轴',
            '二次轴',
            '三次轴',
            '四次轴',
            '四次旋转反伸轴',
            '对称轴投影',
            '对称面',
            '对称面投影',
            '晶面投影',
            '目估赤平投影'
        ];
        
        controls.forEach(control => {
            const button = document.createElement('button');
            button.textContent = control;
            button.addEventListener('click', () => this.handleControlClick(control));
            document.getElementById('controls').appendChild(button);
        });
    }
    
    handleControlClick(controlName) {
        switch(controlName) {
            case '坐标轴':
                this.toggleAxes();
                break;
            case '对称面':
                this.toggleSymmetryPlanes();
                break;
            // ... 其他控制功能
        }
    }
    
    toggleAxes() {
        // 显示/隐藏坐标轴
        const axesHelper = new THREE.AxesHelper(5);
        this.scene.add(axesHelper);
    }
    
    animate() {
        requestAnimationFrame(() => this.animate());
        this.controls.update();
        this.renderer.render(this.scene, this.camera);
    }
}
