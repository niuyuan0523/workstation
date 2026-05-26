import './styles/main.css';
import { CrystalViewer } from './CrystalViewer';

document.addEventListener('DOMContentLoaded', () => {
    // 创建容器
    const container = document.createElement('div');
    container.id = 'canvas-container';
    document.body.appendChild(container);

    // 创建信息面板
    const infoPanel = document.createElement('div');
    infoPanel.id = 'info-panel';
    infoPanel.innerHTML = `
        <h3>晶体信息</h3>
        <p id="crystal-name">菱形十二面体立方体</p>
        <p id="crystal-system">晶系：立方晶系</p>
        <p id="symmetry-planes">对称面：9个</p>
        <p id="symmetry-axes">对称轴：13个</p>
        <p id="binary-axes">二次轴：6个</p>
        <p id="ternary-axes">三次轴：4个</p>
        <p id="quaternary-axes">四次轴：3个</p>
        <p id="crystal-description">具有高度对称性的复杂立方体结构，拥有9个平面对称、13个对称轴、6个二次轴、4个三次轴和3个四次轴</p>
    `;
    document.body.appendChild(infoPanel);

    // 创建控制按钮
    const controls = document.createElement('div');
    controls.id = 'controls';
    document.body.appendChild(controls);

    const buttons = [
        { 
            id: 'bipyramidal', 
            text: '菱形十二面体立方体',
            name: '菱形十二面体立方体',
            system: '立方晶系',
            symmetryPlanes: 9,
            symmetryAxes: 13,
            binaryAxes: 6,
            ternaryAxes: 4,
            quaternaryAxes: 3,
            description: '具有高度对称性的复杂立方体结构，拥有9个平面对称、13个对称轴、6个二次轴、4个三次轴和3个四次轴'
        },
        { 
            id: 'hexagonal', 
            text: '六方双锥',
            name: '六方双锥',
            system: '六方晶系',
            symmetryPlanes: 11,
            symmetryAxes: 7,
            binaryAxes: 9,
            ternaryAxes: 0,
            quaternaryAxes: 0,
            description: '六方对称的双锥结构，拥有11个平面对称、7个对称轴和9个二次轴，无三次轴和四次轴'
        },
        { 
            id: 'rhombicDodecaCube', 
            text: '四方双锥',
            name: '四方双锥',
            system: '四方晶系',
            symmetryPlanes: 7,
            symmetryAxes: 5,
            binaryAxes: 4,
            ternaryAxes: 0,
            quaternaryAxes: 1,
            description: '四方对称的双锥结构，拥有7个平面对称、5个对称轴、4个二次轴、无三次轴和1个四次轴'
        },
        { 
            id: 'boxGeometry2', 
            text: '双斜方柱',
            name: '双斜方柱',
            system: '斜方晶系',
            symmetryPlanes: 3,
            symmetryAxes: 3,
            binaryAxes: 3,
            ternaryAxes: 0,
            quaternaryAxes: 0,
            description: '具有三个互相垂直平面对称的柱状结构，拥有3个对称轴（全部为二次轴），无三次轴和四次轴'
        },
    ];

    // 创建晶体查看器
    const viewer = new CrystalViewer(container);

    // 更新信息面板的函数
    function updateInfoPanel(buttonData) {
        document.getElementById('crystal-name').textContent = buttonData.name;
        document.getElementById('crystal-system').textContent = `晶系：${buttonData.system}`;
        document.getElementById('symmetry-planes').textContent = `对称面：${buttonData.symmetryPlanes}个`;
        document.getElementById('symmetry-axes').textContent = `对称轴：${buttonData.symmetryAxes}个`;
        document.getElementById('binary-axes').textContent = `二次轴：${buttonData.binaryAxes}个`;
        document.getElementById('ternary-axes').textContent = `三次轴：${buttonData.ternaryAxes}个`;
        document.getElementById('quaternary-axes').textContent = `四次轴：${buttonData.quaternaryAxes}个`;
        document.getElementById('crystal-description').textContent = buttonData.description;
    }

    // 添加按钮
    buttons.forEach(button => {
        const btn = document.createElement('button');
        btn.className = 'crystal-button';
        btn.textContent = button.text;
        btn.addEventListener('click', () => {
            // 更新按钮状态
            document.querySelectorAll('.crystal-button').forEach(b => 
                b.classList.remove('active'));
            btn.classList.add('active');
            
            // 更新信息面板
            updateInfoPanel(button);
            
            // 显示选中的晶体
            viewer.showCrystal(button.id);
        });
        controls.appendChild(btn);
    });

    // 创建坐标轴控制按钮
    const axesHelper = document.createElement('div');
    axesHelper.id = 'axesHelper';
    document.body.appendChild(axesHelper);
    
    // 创建按钮行容器
    const buttonRow = document.createElement('div');
    buttonRow.className = 'button-row';
    axesHelper.appendChild(buttonRow);
    
    const axesButton = document.createElement('button');
    axesButton.className = 'axesHelper-button';
    axesButton.textContent = '显示坐标轴';
    axesButton.addEventListener('click', () => {
        if (axesButton.classList.contains('active')) {
            // 如果当前是激活状态，则隐藏坐标轴
            axesButton.classList.remove('active');
            axesButton.textContent = '显示坐标轴';
            viewer.hideAxesHelper();
        } else {
            // 如果当前是非激活状态，则显示坐标轴
            axesButton.classList.add('active');
            axesButton.textContent = '隐藏坐标轴';
            viewer.showAxesHelper();
        }
    });
    buttonRow.appendChild(axesButton);

    // 创建切面控制按钮
    const clippingButton = document.createElement('button');
    clippingButton.className = 'axesHelper-button';
    clippingButton.textContent = '显示X轴切面';
    clippingButton.addEventListener('click', () => {
        if (clippingButton.classList.contains('active')) {
            // 如果当前是激活状态，则隐藏切面
            clippingButton.classList.remove('active');
            clippingButton.textContent = '显示X轴切面';
            viewer.hideClippingPlane();
            // 隐藏滑块
            clippingSlider.style.display = 'none';
        } else {
            // 如果当前是非激活状态，则显示切面
            clippingButton.classList.add('active');
            clippingButton.textContent = '隐藏X轴切面';
            viewer.showClippingPlane();
            // 显示滑块
            clippingSlider.style.display = 'block';
        }
    });
    buttonRow.appendChild(clippingButton);

    // 创建平面对称控制按钮
    const symmetryButton = document.createElement('button');
    symmetryButton.className = 'axesHelper-button';
    symmetryButton.textContent = '显示平面对称';
    symmetryButton.addEventListener('click', () => {
        if (symmetryButton.classList.contains('active')) {
            // 如果当前是激活状态，则隐藏平面对称
            symmetryButton.classList.remove('active');
            symmetryButton.textContent = '显示平面对称';
            viewer.hideSymmetryPlanes();
        } else {
            // 如果当前是非激活状态，则显示平面对称
            symmetryButton.classList.add('active');
            symmetryButton.textContent = '隐藏平面对称';
            viewer.showSymmetryPlanes();
        }
    });
    buttonRow.appendChild(symmetryButton);

    // 创建对称轴投影控制按钮
    const symmetryAxesButton = document.createElement('button');
    symmetryAxesButton.className = 'axesHelper-button';
    symmetryAxesButton.textContent = '显示对称轴投影';
    symmetryAxesButton.addEventListener('click', () => {
        if (symmetryAxesButton.classList.contains('active')) {
            // 如果当前是激活状态，则隐藏对称轴投影
            symmetryAxesButton.classList.remove('active');
            symmetryAxesButton.textContent = '显示对称轴投影';
            viewer.hideSymmetryAxes();
        } else {
            // 如果当前是非激活状态，则显示对称轴投影
            symmetryAxesButton.classList.add('active');
            symmetryAxesButton.textContent = '隐藏对称轴投影';
            viewer.showSymmetryAxes();
        }
    });
    buttonRow.appendChild(symmetryAxesButton);

    // 创建二次旋转对称轴控制按钮
    const binaryAxesButton = document.createElement('button');
    binaryAxesButton.className = 'axesHelper-button';
    binaryAxesButton.textContent = '显示二次轴';
    binaryAxesButton.addEventListener('click', () => {
        if (binaryAxesButton.classList.contains('active')) {
            // 如果当前是激活状态，则隐藏二次旋转对称轴
            binaryAxesButton.classList.remove('active');
            binaryAxesButton.textContent = '显示二次轴';
            viewer.hideBinaryAxes();
        } else {
            // 如果当前是非激活状态，则显示二次旋转对称轴
            binaryAxesButton.classList.add('active');
            binaryAxesButton.textContent = '隐藏二次轴';
            viewer.showBinaryAxes();
        }
    });
    buttonRow.appendChild(binaryAxesButton);

    // 创建三次旋转对称轴控制按钮
    const ternaryAxesButton = document.createElement('button');
    ternaryAxesButton.className = 'axesHelper-button';
    ternaryAxesButton.textContent = '显示三次轴';
    ternaryAxesButton.addEventListener('click', () => {
        if (ternaryAxesButton.classList.contains('active')) {
            // 如果当前是激活状态，则隐藏三次旋转对称轴
            ternaryAxesButton.classList.remove('active');
            ternaryAxesButton.textContent = '显示三次轴';
            viewer.hideTernaryAxes();
        } else {
            // 如果当前是非激活状态，则尝试显示三次旋转对称轴
            const success = viewer.showTernaryAxes();
            if (success) {
                ternaryAxesButton.classList.add('active');
                ternaryAxesButton.textContent = '隐藏三次轴';
            } else {
                console.log('当前晶体没有三次旋转对称轴！\n\n只有立方晶系具有三次旋转对称轴。');
                // 显示提示信息
                // alert('当前晶体没有三次旋转对称轴！\n\n只有立方晶系具有三次旋转对称轴。');
            }
        }
    });
    buttonRow.appendChild(ternaryAxesButton);

    // 创建四次旋转对称轴控制按钮
    const quaternaryAxesButton = document.createElement('button');
    quaternaryAxesButton.className = 'axesHelper-button';
    quaternaryAxesButton.textContent = '显示四次轴';
    quaternaryAxesButton.addEventListener('click', () => {
        if (quaternaryAxesButton.classList.contains('active')) {
            // 如果当前是激活状态，则隐藏四次旋转对称轴
            quaternaryAxesButton.classList.remove('active');
            quaternaryAxesButton.textContent = '显示四次轴';
            viewer.hideQuaternaryAxes();
        } else {
            // 如果当前是非激活状态，则尝试显示四次旋转对称轴
            const success = viewer.showQuaternaryAxes();
            if (success) {
                quaternaryAxesButton.classList.add('active');
                quaternaryAxesButton.textContent = '隐藏四次轴';
            } else {
                console.log('当前晶体没有四次旋转对称轴！\n\n立方晶系和四方晶系具有四次旋转对称轴。');
                // 显示提示信息
                // alert('当前晶体没有四次旋转对称轴！\n\n立方晶系和四方晶系具有四次旋转对称轴。');
            }
        }
    });
    buttonRow.appendChild(quaternaryAxesButton);

    // 创建切面位置控制滑块
    const clippingSlider = document.createElement('input');
    clippingSlider.type = 'range';
    clippingSlider.min = '-4';
    clippingSlider.max = '4';
    clippingSlider.step = '0.1';
    clippingSlider.value = '0';
    clippingSlider.className = 'clipping-slider';
    clippingSlider.style.display = 'none';
    clippingSlider.addEventListener('input', (e) => {
        viewer.updateClippingPlane(parseFloat(e.target.value));
    });
    axesHelper.appendChild(clippingSlider);

    // 默认显示第一个晶体
    viewer.showCrystal('bipyramidal');
    controls.firstChild.classList.add('active');
    updateInfoPanel(buttons[0]);
});
