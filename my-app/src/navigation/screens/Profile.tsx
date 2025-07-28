import { Text } from '@react-navigation/elements';
import { StaticScreenProps } from '@react-navigation/native';
import { StyleSheet, View, ScrollView, Animated, Dimensions } from 'react-native';
import { useState, useEffect, useMemo, useRef } from 'react';

type Props = StaticScreenProps<{
  user: string;
}>;

const { width: screenWidth } = Dimensions.get('window');

// Heavy particle animation component
const ParticleSystem = ({ count }: { count: number }) => {
  const particles = useRef(
    Array.from({ length: count }, () => ({
      x: new Animated.Value(Math.random() * screenWidth),
      y: new Animated.Value(Math.random() * 600),
      opacity: new Animated.Value(Math.random()),
      scale: new Animated.Value(0.5 + Math.random() * 0.5),
    }))
  ).current;

  useEffect(() => {
    const animations = particles.map((particle, index) => {
      return Animated.loop(
        Animated.parallel([
          Animated.sequence([
            Animated.timing(particle.x, {
              toValue: Math.random() * screenWidth,
              duration: 3000 + (index * 100),
              useNativeDriver: true,
            }),
            Animated.timing(particle.x, {
              toValue: Math.random() * screenWidth,
              duration: 3000 + (index * 100),
              useNativeDriver: true,
            }),
          ]),
          Animated.sequence([
            Animated.timing(particle.y, {
              toValue: Math.random() * 600,
              duration: 4000 + (index * 150),
              useNativeDriver: true,
            }),
            Animated.timing(particle.y, {
              toValue: Math.random() * 600,
              duration: 4000 + (index * 150),
              useNativeDriver: true,
            }),
          ]),
          Animated.sequence([
            Animated.timing(particle.opacity, {
              toValue: 0.1,
              duration: 2000,
              useNativeDriver: true,
            }),
            Animated.timing(particle.opacity, {
              toValue: 1,
              duration: 2000,
              useNativeDriver: true,
            }),
          ]),
          Animated.sequence([
            Animated.timing(particle.scale, {
              toValue: 1.5,
              duration: 2500,
              useNativeDriver: true,
            }),
            Animated.timing(particle.scale, {
              toValue: 0.3,
              duration: 2500,
              useNativeDriver: true,
            }),
          ]),
        ])
      );
    });

    animations.forEach(animation => animation.start());

    return () => {
      animations.forEach(animation => animation.stop());
    };
  }, [particles]);

  return (
    <View style={styles.particleContainer}>
      {particles.map((particle, index) => (
        <Animated.View
          key={index}
          style={[
            styles.particle,
            {
              backgroundColor: `hsl(${(index * 15) % 360}, 80%, 60%)`,
              transform: [
                { translateX: particle.x },
                { translateY: particle.y },
                { scale: particle.scale },
              ],
              opacity: particle.opacity,
            },
          ]}
        />
      ))}
    </View>
  );
};

// Heavy data visualization component
const DataVisualization = ({ data, title }: { data: number[]; title: string }) => {
  const maxValue = Math.max(...data);
  
  return (
    <View style={styles.chartContainer}>
      <Text style={styles.chartTitle}>{title}</Text>
      <View style={styles.chart}>
        {data.map((value, index) => (
          <View
            key={index}
            style={[
              styles.chartBar,
              {
                height: (value / maxValue) * 100,
                backgroundColor: `hsl(${(value * 10) % 360}, 70%, 50%)`,
              },
            ]}
          />
        ))}
      </View>
    </View>
  );
};

// Heavy computation component
const ProfileMetrics = ({ user, index }: { user: string; index: number }) => {
  const computation = useMemo(() => {
    let result = 0;
    const userHash = user.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    
    for (let i = 0; i < 30000; i++) {
      result += Math.sin(i + userHash) * Math.cos(i * index) * Math.log(i + 1);
    }
    return result;
  }, [user, index]);

  const metrics = useMemo(() => {
    return Array.from({ length: 20 }, (_, i) => 
      Math.abs(computation * Math.sin(i + index)) % 100
    );
  }, [computation, index]);

  return (
    <View style={styles.metricsContainer}>
      <Text style={styles.metricsTitle}>Profile Metrics #{index + 1}</Text>
      <Text style={styles.computationText}>Heavy computation: {computation.toFixed(4)}</Text>
      <DataVisualization data={metrics} title={`Metric Set ${index + 1}`} />
    </View>
  );
};

export function Profile({ route }: Props) {
  const [profileData, setProfileData] = useState<any[]>([]);
  const [animationCount, setAnimationCount] = useState(0);

  // Generate heavy profile data
  const data = Array.from({ length: 25 }, (_, i) => ({
      id: i,
      section: `Profile Section ${i + 1}`,
      data: Array.from({ length: 50 }, () => Math.random() * 1000),
    }));


  // Continuous animation counter
  useEffect(() => {
    const interval = setInterval(() => {
      setAnimationCount(prev => prev + 1);
    }, 1000);
    
    return () => clearInterval(interval);
  }, []);

  // Global heavy computation
  const globalStats = useMemo(() => {
    if (!route.params.user) return { complexity: 0, performance: 0 };
    
    let complexity = 0;
    let performance = 0;
    
    for (let i = 0; i < 75000; i++) {
      complexity += Math.sin(i * route.params.user.length) * Math.cos(animationCount + i);
      performance += Math.tan(i / (route.params.user.length + 1)) * Math.log(i + 1);
    }
    
    return {
      complexity: complexity / 1000,
      performance: performance / 1000,
    };
  }, [route.params.user, animationCount]);

  return (
    <View style={styles.container}>
      <ParticleSystem count={30} />
      
      <ScrollView style={styles.scrollContainer} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>{route.params.user}'s Heavy Profile</Text>
          <Text style={styles.statsText}>Animations: {animationCount}</Text>
          <Text style={styles.statsText}>Complexity: {globalStats.complexity.toFixed(2)}</Text>
          <Text style={styles.statsText}>Performance: {globalStats.performance.toFixed(2)}</Text>
        </View>

        <View style={styles.mainContent}>
          {data.map((item, index) => (
            <ProfileMetrics key={`${item.id}-${animationCount}`} user={route.params.user} index={index} />
          ))}
        </View>

        <View style={styles.footer}>
          <Text style={styles.footerText}>Profile loaded with {profileData.length} heavy sections</Text>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'blue',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'blue',
  },
  loadingText: {
    fontSize: 18,
    color: 'white',
    fontWeight: 'bold',
  },
  particleContainer: {
    ...StyleSheet.absoluteFillObject,
    zIndex: -1,
  },
  particle: {
    position: 'absolute',
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  scrollContainer: {
    flex: 1,
    zIndex: 1,
  },
  header: {
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    padding: 20,
    alignItems: 'center',
    marginBottom: 20,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 15,
    textAlign: 'center',
  },
  statsText: {
    fontSize: 14,
    color: 'white',
    marginBottom: 5,
    fontFamily: 'monospace',
  },
  mainContent: {
    padding: 15,
  },
  metricsContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderRadius: 12,
    padding: 20,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 8,
  },
  metricsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
  },
  computationText: {
    fontSize: 12,
    color: '#666',
    fontFamily: 'monospace',
    marginBottom: 15,
    backgroundColor: '#f0f0f0',
    padding: 8,
    borderRadius: 4,
  },
  chartContainer: {
    marginTop: 10,
  },
  chartTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#444',
    marginBottom: 10,
    textAlign: 'center',
  },
  chart: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    height: 120,
    backgroundColor: '#f8f8f8',
    padding: 10,
    borderRadius: 8,
    gap: 2,
  },
  chartBar: {
    flex: 1,
    minHeight: 5,
    borderRadius: 2,
    marginHorizontal: 1,
  },
  footer: {
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    padding: 20,
    alignItems: 'center',
    marginTop: 20,
  },
  footerText: {
    fontSize: 16,
    color: 'white',
    textAlign: 'center',
  },
});
