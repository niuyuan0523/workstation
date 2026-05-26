import * as THREE from 'three';

export class DoublePrismComposite {
    constructor() {
        // 创建一个组来容纳所有的网格
        this.group = new THREE.Group();
        this.createMesh();
    }

    createMesh() {
        // 定义更精细的材质 - 使用半透明的绿色材质
        const material = new THREE.MeshPhongMaterial({
            color: 0x27AE60,      // 更鲜艳的绿色
            transparent: true,     // 启用透明
            opacity: 0.85,        // 调整透明度
            roughness: 0.3,
            metalness: 0.4,
            shininess: 100,       // 增加光泽度
            specular: 0x222222
        });

        // 定义更明显的边线材质 - 使用白色线条
        const edgeMaterial = new THREE.LineBasicMaterial({
            color: 0xffffff,
            linewidth: 3,
            transparent: true,
            opacity: 0.8
        });

        // 创建几何体
        const geometry = new THREE.BufferGeometry();

        // 定义顶点坐标 - 增大尺寸以获得更好的显示效果
        const vertices = new Float32Array([
            // 上面的长方形 (较小)
            -1.2, 1.2, -0.75,    
            1.2, 1.2, -0.75,     
            1.2, 1.2, 0.75,      
            -1.2, 1.2, 0.75,     

            // 下面的长方形 (较大)
            -1.8, 0.0, -1.05,    
            1.8, 0.0, -1.05,     
            1.8, 0.0, 1.05,      
            -1.8, 0.0, 1.05      
        ]);

        // 定义面的索引
        const indices = new Uint16Array([
            // 上面
            0, 1, 2,
            0, 2, 3,
            
            // 下面
            4, 6, 5,
            4, 7, 6,
            
            // 前面
            0, 4, 5,
            0, 5, 1,
            
            // 后面
            2, 6, 7,
            2, 7, 3,
            
            // 左面
            0, 3, 7,
            0, 7, 4,
            
            // 右面
            1, 5, 6,
            1, 6, 2
        ]);

        // 创建原始几何体
        geometry.setAttribute('position', new THREE.BufferAttribute(vertices, 3));
        geometry.setIndex(new THREE.BufferAttribute(indices, 1));
        geometry.computeVertexNormals();

        // 创建原始网格和边线
        const mesh = new THREE.Mesh(geometry, material);
        mesh.castShadow = true;
        mesh.receiveShadow = true;
        
        const edges = new THREE.LineSegments(new THREE.EdgesGeometry(geometry), edgeMaterial);
        
        // 创建翻转的几何体
        const flippedGeometry = geometry.clone();
        const flippedPositions = flippedGeometry.attributes.position.array;
        
        // 翻转顶点坐标 (绕xy轴180度旋转)
        for(let i = 0; i < flippedPositions.length; i += 3) {
            flippedPositions[i + 1] = -flippedPositions[i + 1]; // y坐标取反
        }
        
        flippedGeometry.attributes.position.needsUpdate = true;
        flippedGeometry.computeVertexNormals();
        
        // 创建翻转的网格和边线
        const flippedMesh = new THREE.Mesh(flippedGeometry, material);
        flippedMesh.castShadow = true;
        flippedMesh.receiveShadow = true;
        
        const flippedEdges = new THREE.LineSegments(new THREE.EdgesGeometry(flippedGeometry), edgeMaterial);

        // 将所有网格和边线添加到组中
        this.group.add(mesh);
        this.group.add(edges);
        this.group.add(flippedMesh);
        this.group.add(flippedEdges);

        // 调整整体位置和旋转
        this.group.rotation.y = Math.PI / 6;   // 整体旋转30度
    }

    // 获取整个组的网格
    getMesh() {
        return this.group;
    }
}
