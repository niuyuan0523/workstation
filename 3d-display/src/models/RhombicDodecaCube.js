import * as THREE from 'three';

export class RhombicDodecaCube {
    constructor() {
        this.group = new THREE.Group();
        this.createMesh();
    }
    createMesh() {
        // 创建更精细的立方体材质
        const material = new THREE.MeshPhongMaterial({ 
            color: 0xFF6B35,  // 更鲜艳的橙色
            transparent: true,
            opacity: 0.8,
            roughness: 0.2,
            metalness: 0.3,
            shininess: 120,
            specular: 0x444444,
            side: THREE.DoubleSide
        });

        // 创建更明显的边线材质
        const edgeMaterial = new THREE.LineBasicMaterial({ 
            color: 0xffffff,
            linewidth: 3,
            transparent: true,
            opacity: 0.9
        });

        // 定义顶点坐标 - 增大尺寸以获得更好的显示效果
        const vertices = [
            // 前面四个顶点 (z轴正向移动0.6)
            new THREE.Vector3(-1.8, -1.8, 2.2),  // 0
            new THREE.Vector3(1.8, -1.8, 2.2),   // 1
            new THREE.Vector3(1.8, 1.8, 2.2),    // 2
            new THREE.Vector3(-1.8, 1.8, 2.2),   // 3
            
            // 后面四个顶点 (z轴负向移动0.6)
            new THREE.Vector3(-1.8, -1.8, -2.2), // 4
            new THREE.Vector3(1.8, -1.8, -2.2),  // 5
            new THREE.Vector3(1.8, 1.8, -2.2),   // 6
            new THREE.Vector3(-1.8, 1.8, -2.2),  // 7

            // 上面四个顶点 (y轴正向移动0.6)
            new THREE.Vector3(-1.8, 2.2, 1.8),   // 8
            new THREE.Vector3(1.8, 2.2, 1.8),    // 9
            new THREE.Vector3(1.8, 2.2, -1.8),   // 10
            new THREE.Vector3(-1.8, 2.2, -1.8),  // 11

            // 下面四个顶点 (y轴负向移动0.6)
            new THREE.Vector3(-1.8, -2.2, 1.8),  // 12
            new THREE.Vector3(1.8, -2.2, 1.8),   // 13
            new THREE.Vector3(1.8, -2.2, -1.8),  // 14
            new THREE.Vector3(-1.8, -2.2, -1.8), // 15

            // 右面四个顶点 (x轴正向移动0.6)
            new THREE.Vector3(2.2, -1.8, 1.8),   // 16
            new THREE.Vector3(2.2, 1.8, 1.8),    // 17
            new THREE.Vector3(2.2, 1.8, -1.8),   // 18
            new THREE.Vector3(2.2, -1.8, -1.8),  // 19

            // 左面四个顶点 (x轴负向移动0.6)
            new THREE.Vector3(-2.2, -1.8, 1.8),  // 20
            new THREE.Vector3(-2.2, 1.8, 1.8),   // 21
            new THREE.Vector3(-2.2, 1.8, -1.8),  // 22
            new THREE.Vector3(-2.2, -1.8, -1.8)  // 23
        ];

        // 定义面，使用不同颜色来区分不同类型的面
        const faces = [
            // 主要的6个面 - 使用主材质
            { indices: [0, 1, 2, 3], color: 0xFF6B35 },     // 前面
            { indices: [4, 5, 6, 7], color: 0xFF6B35 },     // 后面 
            { indices: [8, 9, 10, 11], color: 0xFF6B35 },   // 上面
            { indices: [12, 13, 14, 15], color: 0xFF6B35 }, // 下面
            { indices: [16, 17, 18, 19], color: 0xFF6B35 }, // 右面
            { indices: [20, 21, 22, 23], color: 0xFF6B35 }, // 左面
            
            // 连接面 - 使用稍微不同的颜色
            { indices: [9, 10, 18, 17], color: 0xE55A2B },   // 连接上面和右面
            { indices: [8, 11, 22, 21], color: 0xE55A2B },   // 连接上面和左面
            { indices: [13, 14, 19, 16], color: 0xE55A2B },  // 连接下面和右面
            { indices: [12, 15, 23, 20], color: 0xE55A2B },  // 连接下面和左面
            { indices: [1, 2, 17, 16], color: 0xCC4A1F },    // 连接前面和右面
            { indices: [0, 3, 21, 20], color: 0xCC4A1F },    // 连接前面和左面
            { indices: [5, 6, 18, 19], color: 0xCC4A1F },    // 连接后面和右面
            { indices: [4, 7, 22, 23], color: 0xCC4A1F },    // 连接后面和左面
            { indices: [8, 9, 2, 3], color: 0xB8421A },      // 连接上面和前面
            { indices: [10, 11, 7, 6], color: 0xB8421A },    // 连接上面和后面
            { indices: [14, 15, 4, 5], color: 0xB8421A },    // 连接下面和后面
            { indices: [12, 13, 1, 0], color: 0xB8421A },    // 连接下面和前面
        ];

        // 创建每个面
        faces.forEach(face => {
            const geometry = new THREE.BufferGeometry();
            
            // 从顶点数组中获取面的顶点
            const faceVertices = face.indices.map(index => vertices[index]);
            
            // 转换为Float32Array
            const positions = new Float32Array(faceVertices.flatMap(v => [v.x, v.y, v.z]));
            
            geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
            geometry.setIndex([0, 1, 2, 0, 2, 3]); // 定义三角形
            geometry.computeVertexNormals();

            // 为每个面创建稍微不同的材质
            const faceMaterial = material.clone();
            faceMaterial.color.setHex(face.color);

            const mesh = new THREE.Mesh(geometry, faceMaterial);
            mesh.castShadow = true;
            mesh.receiveShadow = true;
            
            const edges = new THREE.LineSegments(
                new THREE.EdgesGeometry(geometry),
                edgeMaterial
            );

            this.group.add(mesh);
            this.group.add(edges);
        });
    }

    getMesh() {
        return this.group;
    }
}